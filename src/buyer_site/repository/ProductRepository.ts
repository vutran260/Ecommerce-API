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
import { ProductCompomentFromLP_PRODUCT_COMPONENT } from '../../common/model/products/ProductCompoment';
import {
  LP_PRODUCT_CATEGORYCreationAttributes,
} from '../../lib/mysql/models/LP_PRODUCT_CATEGORY';
import lodash, { forEach } from 'lodash';
import { Op, Sequelize } from 'sequelize';

export class ProductRepository {
  public getProductId = async (id: string): Promise<Product> => {
    const result = await LP_PRODUCT.findByPk(id);
    if (!result) {
      throw new NotFoundError(`Product with id ${id} not found`);
    }

    if (result.dataValues.isDeleted === 1 || result.dataValues.status === 'INACTIVE') {
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
    isNoCategory: boolean,
  ) => {
    try {
      this.filterSortByPrice(order);

      filter.push({
        operation: 'eq',
        value: 0,
        attribute: 'isDeleted',
      }, {
        operation: 'eq',
        value: 'ACTIVE',
        attribute: 'status',
      });

      let query = BuildQuery(filter);

      if(isNoCategory){
        query = {
          [Op.and]:[
            query,
            { '$categoryIdLpCategories.id$': null,}
          ]
        }
      }


      const  include: any[] = [
        {
          association: LP_PRODUCT.associations.categoryIdLpCategories,
          
        },
      ]

      if (categoryIds !== null && !isNoCategory) { 
        include.push (
        {
          association: LP_PRODUCT.associations.lpProductCategories,
          where: { categoryId: { [Op.in]: categoryIds } },
        }
        )
      }

      const count = await LP_PRODUCT.count({
        include: include,
        where: query,
        distinct:true,
        col: 'id'
      });
      paging.total = count;




      const results = await LP_PRODUCT.findAll({
        subQuery: false,

        attributes: {
          include: [
            [Sequelize.literal(`
        CASE
        WHEN LP_PRODUCT.is_subscription = 0 AND LP_PRODUCT.is_discount = 0  THEN LP_PRODUCT.price
        WHEN LP_PRODUCT.is_subscription = 1 AND LP_PRODUCT.is_discount = 0  THEN LP_PRODUCT.price_subscription
        WHEN  LP_PRODUCT.is_discount = 1 AND 
          ( LP_PRODUCT.has_discount_schedule = 0 OR
            LP_PRODUCT.has_discount_schedule = 1 
            AND CURRENT_DATE BETWEEN DATE_FORMAT(LP_PRODUCT.discount_time_from, '%Y-%m-%d') 
            AND DATE_FORMAT(LP_PRODUCT.discount_time_to, '%Y-%m-%d')
          )
          AND LP_PRODUCT.is_subscription = 0
          THEN ROUND(LP_PRODUCT.price * (100 - LP_PRODUCT.discount_percentage) / 100)
        WHEN  LP_PRODUCT.is_discount = 1 AND 
          ( LP_PRODUCT.has_discount_schedule = 0 OR
            LP_PRODUCT.has_discount_schedule = 1 
            AND CURRENT_DATE BETWEEN DATE_FORMAT(LP_PRODUCT.discount_time_from, '%Y-%m-%d') 
            AND DATE_FORMAT(LP_PRODUCT.discount_time_to, '%Y-%m-%d')
          )
          AND LP_PRODUCT.is_subscription = 1
          THEN ROUND(LP_PRODUCT.price_subscription * (100 - LP_PRODUCT.discount_percentage) / 100)
        WHEN LP_PRODUCT.is_subscription = 1 THEN LP_PRODUCT.price_subscription
        ELSE LP_PRODUCT.price
        END`), 
        'sortPrice']
          ],
        },

        include: include,
        where: query,
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




private filterSortByPrice = (orders: LpOrder[]) => {
  orders.forEach(item => {
    if (item.attribute === 'price') {
      item.attribute = 'sortPrice';
    }
  });
};
}

export interface CreateProductInput extends LP_PRODUCTCreationAttributes {
  lpProductComponents: LP_PRODUCT_COMPONENTCreationAttributes[];
  lpProductCategories: LP_PRODUCT_CATEGORYCreationAttributes[];
}

