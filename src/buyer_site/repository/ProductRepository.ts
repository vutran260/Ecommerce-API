import Product, {
  ProductFromLP_PRODUCT,
} from '../../common/model/products/Product';
import Logger from '../../lib/core/Logger';
import { NotFoundError } from '../../lib/http/custom_error/ApiError';
import {
  BuildQuery,
  Filter,
  GetOffset,
  Paging,
} from '../../lib/paging/Request';
import {
  LP_PRODUCT,
  LP_PRODUCTCreationAttributes,
} from '../../lib/mysql/models/LP_PRODUCT';
import { BuildOrderQuery, LpOrder } from '../../lib/paging/Order';
import { LP_PRODUCT_COMPONENTCreationAttributes } from '../../lib/mysql/models/LP_PRODUCT_COMPONENT';
import { LP_PRODUCT_OPTIONCreationAttributes } from '../../lib/mysql/models/LP_PRODUCT_OPTION';
import { LP_PRODUCT_OPTION_PRICECreationAttributes } from '../../lib/mysql/models/LP_PRODUCT_OPTION_PRICE';
import { ProductCompomentFromLP_PRODUCT_COMPONENT } from '../../common/model/products/ProductCompoment';
import { ProductOptionFromLP_PRODUCT_OPTION } from '../../common/model/products/ProductOption';
import { ProductOptionPriceFromLP_PRODUCT_OPTION_PRICE } from '../../common/model/products/ProductOptionPrice';
import {
  LP_PRODUCT_CATEGORYCreationAttributes,
} from '../../lib/mysql/models/LP_PRODUCT_CATEGORY';
import lodash, { forEach } from 'lodash';
import { Op } from 'sequelize';

export class ProductRepository {
  public getProductId = async (id: string): Promise<Product> => {
    const result = await LP_PRODUCT.findByPk(id);
    if (!result) {
      throw new NotFoundError(`Product with id ${id} not found`);
    }

    const out: Product = ProductFromLP_PRODUCT(result.dataValues);

    (await result.getLpProductComponents()).forEach((component) =>
      out.components.push(
        ProductCompomentFromLP_PRODUCT_COMPONENT(component.dataValues),
      ),
    );

    (await result.getLpProductCategories()).forEach((category) =>
      out.categories.push(category.dataValues.categoryId),
    );

    (await result.getLpProductFaqs()).forEach((faq) =>
      out.faqs.push(faq.dataValues),
    );

    return out;
  };

  public getProducts = async (
    filter: Filter[],
    order: LpOrder[],
    paging: Paging,
    categoryIds: string[] | null,
  ) => {
    try {
      filter.push({
        operation: 'eq',
        value: 0,
        attribute: 'isDeleted',
      });
      const count = await LP_PRODUCT.count({
        include: categoryIds
          ? [
            {
              association: LP_PRODUCT.associations.lpProductCategories,
              where: { categoryId: { [Op.in]: categoryIds } },
            },
          ]
          : undefined,
        where: BuildQuery(filter),
      });
      paging.total = count;

      const results = await LP_PRODUCT.findAll({
        include: [
          {
            association: LP_PRODUCT.associations.lpProductCategories,
            where: categoryIds
              ? { categoryId: { [Op.in]: categoryIds } }
              : undefined,
          },
          {
            association: LP_PRODUCT.associations.categoryIdLpCategories,
          },
        ],
        where: BuildQuery(filter),
        offset: GetOffset(paging),
        order: BuildOrderQuery(order),
        limit: paging.limit,
      });
      forEach(results, (result) => {
        lodash.unset(result.dataValues, 'lpProductCategories');
      });
      return results;
    } catch (error: any) {
      Logger.error(error);
      Logger.error(error.message);
      throw error;
    }
  };
}

export interface CreateProductInput extends LP_PRODUCTCreationAttributes {
  lpProductComponents: LP_PRODUCT_COMPONENTCreationAttributes[];
  lpProductCategories: LP_PRODUCT_CATEGORYCreationAttributes[];
}
