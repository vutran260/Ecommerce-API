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
import {
  LP_PRODUCT_CATEGORY,
  LP_PRODUCT_CATEGORYCreationAttributes,
} from '../../lib/mysql/models/LP_PRODUCT_CATEGORY';
import lodash, { forEach } from 'lodash';
import { Op } from 'sequelize';
import Product, { ProductFromLP_PRODUCT, ProductToLP_PRODUCT } from '../../common/model/products/Product';
import { ProductCompomentFromLP_PRODUCT_COMPONENT } from '../../common/model/products/ProductCompoment';
import { ProductOptionFromLP_PRODUCT_OPTION } from '../../common/model/products/ProductOption';
import { ProductOptionPriceFromLP_PRODUCT_OPTION_PRICE } from '../../common/model/products/ProductOptionPrice';

export class ProductRepository {
  public createProduct = async (
    input: CreateProductInput,
  ): Promise<Product> => {
    const product = await LP_PRODUCT.create(input);

    await Promise.all(
      input.lpProductComponents.map((component) => {
        return product.createLpProductComponent(component);
      }),
    );
    await Promise.all(
      input.lpProductOptions.map((option) => {
        return product.createLpProductOption(option);
      }),
    );
    await Promise.all(
      input.lpProductOptionPrices.map((optionPrice) => {
        return product.createLpProductOptionPrice(optionPrice);
      }),
    );

    await Promise.all(
      input.lpProductCategories.map((category) => {
        return product.createLpProductCategory(category);
      }),
    );

    return this.getProductId(product.id);
  };

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
    (await result.getLpProductOptions()).forEach((option) =>
      out.options.push(ProductOptionFromLP_PRODUCT_OPTION(option.dataValues)),
    );

    (await result.getLpProductOptionPrices()).forEach((optionPrice) =>
      out.optionPrices.push(
        ProductOptionPriceFromLP_PRODUCT_OPTION_PRICE(optionPrice.dataValues),
      ),
    );

    (await result.getLpProductCategories()).forEach((category) =>
      out.categories.push(category.dataValues.categoryId),
    );

    return out;
  };

  public updateProduct = async (input: Product): Promise<Product> => {
    try {
      const lpProduct = await LP_PRODUCT.findByPk(input.id);
      if (!lpProduct) {
        throw new NotFoundError(`Product with id ${input.id} not found`);
      }
      await lpProduct.update(ProductToLP_PRODUCT(input));

      (await lpProduct.getLpProductComponents()).forEach(async (component) => {
        await component.destroy();
      });

      await Promise.all(
        input.components.map((component) => {
          return lpProduct.createLpProductComponent(
            ProductCompomentFromLP_PRODUCT_COMPONENT(component),
          );
        }),
      );

      await LP_PRODUCT_CATEGORY.destroy({
        where: {
          productId: input.id,
        },
      });

      await Promise.all(
        input.categories.map((category) => {
          return lpProduct.createLpProductCategory({
            categoryId: category,
            productId: input.id,
          });
        }),
      );

      return await this.getProductId(input.id);
    } catch (error: any) {
      Logger.error(error.message);
      throw error;
    }
  };

  public deleteProducts = async (ids: string[]) => {
    try {
      ids.forEach(async (id) => {
        const lpProduct = await LP_PRODUCT.findByPk(id);
        if (!lpProduct) {
          throw new NotFoundError(`Product with id ${id} not found`);
        }
        await lpProduct.update({ isDeleted: 1, deletedAt: new Date() });
      });
    } catch (error: any) {
      Logger.error(error);
      throw error;
    }
  };

  public getProducts = async (
    filter: Filter[],
    order: LpOrder[],
    paging: Paging,
    categoryIds: string[]|null,
  ) => {
    try {
      filter.push({
        operation: 'eq',
        value: 0,
        attribute: 'isDeleted',
      });
      const count = await LP_PRODUCT.count({
        include:[
          {
            association: LP_PRODUCT.associations.lpProductCategories,
            where: categoryIds? {categoryId: {[Op.in]:categoryIds}} : undefined,
          }
        ],
        where: BuildQuery(filter),
      });
      paging.total = count;

      const results = await LP_PRODUCT.findAll({
        include:[
          {
            association: LP_PRODUCT.associations.lpProductCategories,
            where: categoryIds? {categoryId: {[Op.in]:categoryIds}} : undefined
          },
          {
            association: LP_PRODUCT.associations.categoryIdLpCategories,
          }
        ],
        where: BuildQuery(filter),
        offset: GetOffset(paging),
        order: BuildOrderQuery(order),
        limit: paging.limit,
      });
      forEach(results, (result) => {
        lodash.unset(result.dataValues, 'lpProductCategories');
      })
      return results;
    } catch (error: any) {
      Logger.error(error);
      Logger.error(error.message);
      throw error;
    }
  };

  public activeProductId = async (id: string) => {
    await LP_PRODUCT.update(
      {status: "ACTIVE"},
      {where: {id: id}}
    )
  }

  public inactiveProductId = async (id: string) => {
    await LP_PRODUCT.update(
      {status: "INACTIVE"},
      {where: {id: id}}
    )
  }
}

export interface CreateProductInput extends LP_PRODUCTCreationAttributes {
  lpProductComponents: LP_PRODUCT_COMPONENTCreationAttributes[];
  lpProductOptions: LP_PRODUCT_OPTIONCreationAttributes[];
  lpProductOptionPrices: LP_PRODUCT_OPTION_PRICECreationAttributes[];
  lpProductCategories: LP_PRODUCT_CATEGORYCreationAttributes[];
}
