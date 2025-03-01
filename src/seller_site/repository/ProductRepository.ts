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
import {
  LP_PRODUCT_COMPONENTAttributes,
  LP_PRODUCT_COMPONENTCreationAttributes,
} from '../../lib/mysql/models/LP_PRODUCT_COMPONENT';
import {
  LP_PRODUCT_CATEGORY,
  LP_PRODUCT_CATEGORYCreationAttributes,
} from '../../lib/mysql/models/LP_PRODUCT_CATEGORY';
import lodash, { forEach } from 'lodash';
import { Op, Transaction } from 'sequelize';
import Product, {
  ProductFromLP_PRODUCT,
  ProductToLP_PRODUCT,
} from '../../common/model/products/Product';
import { ProductCompomentFromLP_PRODUCT_COMPONENT } from '../../common/model/products/ProductCompoment';
import { LP_PRODUCT_FAQCreationAttributes } from '../../lib/mysql/models/LP_PRODUCT_FAQ';
import ProductFaq, {
  ProductFaqToLP_PRODUCT_COMPONENT,
} from '../../common/model/products/ProductFaq';
import { Sequelize } from 'sequelize-typescript';

export class ProductRepository {
  public createProduct = async (
    input: CreateProductInput,
    t?: Transaction,
  ): Promise<Product> => {
    const product = await LP_PRODUCT.create(input, { transaction: t });

    await Promise.all(
      input.lpProductComponents.map((component) => {
        return product.createLpProductComponent(component, { transaction: t });
      }),
    );

    await Promise.all(
      input.lpProductFaqs.map((faq) => {
        return product.createLpProductFaq(faq, { transaction: t });
      }),
    );

    await Promise.all(
      input.lpProductCategories.map((category) => {
        return product.createLpProductCategory(category, { transaction: t });
      }),
    );

    return this.getProductId(product.id, t);
  };

  public getProductId = async (
    id: string,
    t?: Transaction,
  ): Promise<Product> => {
    const result = await LP_PRODUCT.findByPk(id, { transaction: t });
    if (!result) {
      throw new NotFoundError(`Product with id ${id} not found`);
    }

    const out: Product = ProductFromLP_PRODUCT(result.dataValues);

    (await result.getLpProductComponents({ transaction: t })).forEach(
      (component: { dataValues: LP_PRODUCT_COMPONENTAttributes }) =>
        out.components.push(
          ProductCompomentFromLP_PRODUCT_COMPONENT(component.dataValues),
        ),
    );

    (await result.getLpProductCategories({ transaction: t })).forEach(
      (category: { dataValues: { categoryId: string } }) =>
        out.categories.push(category.dataValues.categoryId),
    );

    (await result.getLpProductFaqs({ transaction: t })).forEach(
      (faq: { dataValues: ProductFaq }) => out.faqs.push(faq.dataValues),
    );

    return out;
  };

  public updateProduct = async (
    input: Product,
    t?: Transaction,
  ): Promise<Product> => {
    try {
      const lpProduct = await LP_PRODUCT.findByPk(input.id, { transaction: t });
      if (!lpProduct || lpProduct.isDeleted) {
        throw new NotFoundError(`Product with id ${input.id} not found`);
      }
      // await lpProduct.update(ProductToLP_PRODUCT(input));

      await LP_PRODUCT.update(ProductToLP_PRODUCT(input), {
        where: {
          id: input.id,
        },
        transaction: t,
      });

      for (const component of await lpProduct.getLpProductComponents({
        transaction: t,
      })) {
        await component.destroy({ transaction: t });
      }

      await Promise.all(
        input.components.map((component) => {
          return lpProduct.createLpProductComponent(
            ProductCompomentFromLP_PRODUCT_COMPONENT(component),
            { transaction: t },
          );
        }),
      );

      for (const faq of await lpProduct.getLpProductFaqs({ transaction: t })) {
        await faq.destroy({ transaction: t });
      }

      await Promise.all(
        input.faqs.map((faq) => {
          return lpProduct.createLpProductFaq(
            ProductFaqToLP_PRODUCT_COMPONENT(faq),
            { transaction: t },
          );
        }),
      );

      await LP_PRODUCT_CATEGORY.destroy({
        where: {
          productId: input.id,
        },
        transaction: t,
      });

      await Promise.all(
        input.categories.map((category) => {
          return lpProduct.createLpProductCategory(
            {
              categoryId: category,
              productId: input.id,
            },
            { transaction: t },
          );
        }),
      );

      return await this.getProductId(input.id, t);
    } catch (error: any) {
      Logger.error('Fail to update product', error);
      Logger.error(error);
      throw error;
    }
  };

  public deleteProducts = async (ids: string[], t?: Transaction) => {
    await LP_PRODUCT.update(
      { isDeleted: 1, deletedAt: new Date() },
      {
        where: {
          id: { [Op.in]: ids },
        },
        transaction: t,
      },
    );
  };

  public getProducts = async (
    filter: Filter[],
    order: LpOrder[],
    paging: Paging,
    categoryIds: string[] | null,
    storeId: string,
    t?: Transaction,
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
        transaction: t,
        distinct: true,
        col: 'id',
      });
      paging.total = count;

      const results = await LP_PRODUCT.findAll({
        attributes: {
          include: [
            [
              Sequelize.literal(`(
                SELECT COALESCE(SUM(oi.quantity), 0)
                FROM LP_ORDER_ITEM oi
                JOIN LP_ORDER o ON oi.order_id = o.id
                WHERE oi.product_id = LP_PRODUCT.id
                AND o.order_status = 'SHIPPED' AND o.store_id = '${storeId}'
              )`),
              'soldQuantity',
            ],
            [
              Sequelize.literal(`(
                SELECT COALESCE(SUM(oi.quantity), 0)
                FROM LP_ORDER_ITEM oi
                JOIN LP_ORDER o ON oi.order_id = o.id
                WHERE oi.product_id = LP_PRODUCT.id
                AND o.order_status != 'CANCEL' AND o.store_id = '${storeId}'
              )`),
              'allocatedStock',
            ],
            [Sequelize.literal(`LP_PRODUCT.stock_item`), 'freeStock'],
          ],
        },
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
        transaction: t,
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

  public activeProductId = async (id: string, t?: Transaction) => {
    await LP_PRODUCT.update(
      { status: 'ACTIVE' },
      { where: { id: id }, transaction: t },
    );
  };

  public inactiveProductId = async (id: string, t?: Transaction) => {
    await LP_PRODUCT.update(
      { status: 'INACTIVE' },
      { where: { id: id }, transaction: t },
    );
  };
}

export interface CreateProductInput extends LP_PRODUCTCreationAttributes {
  lpProductFaqs: LP_PRODUCT_FAQCreationAttributes[];
  lpProductComponents: LP_PRODUCT_COMPONENTCreationAttributes[];
  lpProductCategories: LP_PRODUCT_CATEGORYCreationAttributes[];
}
