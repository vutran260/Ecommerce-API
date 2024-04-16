import Product, { ProductFromLP_PRODUCT } from '../requests/products/Product';
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
  LP_PRODUCTAttributes,
  LP_PRODUCTCreationAttributes,
} from '../../lib/mysql/models/LP_PRODUCT';
import { BuildOrderQuery, LpOrder } from '../../lib/paging/Order';
import {
  LP_PRODUCT_COMPONENT,
  LP_PRODUCT_COMPONENTCreationAttributes,
} from '../../lib/mysql/models/LP_PRODUCT_COMPONENT';
import {
  LP_PRODUCT_OPTION,
  LP_PRODUCT_OPTIONCreationAttributes,
} from '../../lib/mysql/models/LP_PRODUCT_OPTION';
import {
  LP_PRODUCT_OPTION_PRICECreationAttributes,
} from '../../lib/mysql/models/LP_PRODUCT_OPTION_PRICE';
import { ProductCompomentFromLP_PRODUCT_COMPONENT } from '../requests/products/ProductCompoment';
import { ProductOptionFromLP_PRODUCT_OPTION } from '../requests/products/ProductOption';
import { ProductOptionPriceFromLP_PRODUCT_OPTION_PRICE } from '../requests/products/ProductOptionPrice';

export class ProductRepository {
  public createProduct = async (input: CreateProductInput): Promise<Product> => {

    const product = await LP_PRODUCT.create(input);

    await Promise.all(input.lpProductComponents.map((component) => {
      return product.createLpProductComponent(component);
    }))
    await Promise.all(input.lpProductOptions.map((option) => {
      return product.createLpProductOption(option);
    }))
    await Promise.all(input.lpProductOptionPrices.map((optionPrice) => {
      return product.createLpProductOptionPrice(optionPrice);
    }))

    return this.getProductId(product.id);
  };


  public getProductId = async (id: string): Promise<Product> => {
    const result = await LP_PRODUCT.findByPk(id);
    if (!result) {
      throw new NotFoundError(`Product with id ${id} not found`);
    }

    const out: Product = ProductFromLP_PRODUCT( result.dataValues);


    (await result.getLpProductComponents()).forEach(
      (component) => out.components.push(ProductCompomentFromLP_PRODUCT_COMPONENT(component.dataValues))
    );
    (await result.getLpProductOptions()).forEach(
      (option) => out.options.push(ProductOptionFromLP_PRODUCT_OPTION(option.dataValues))
    );

    (await result.getLpProductOptionPrices()).forEach(
      (optionPrice) => out.optionPrices.push(ProductOptionPriceFromLP_PRODUCT_OPTION_PRICE(optionPrice.dataValues))
    );

    return out;
  };

  public updateProduct = async (productCreateRequest: Product, id: string) => {
    try {
      const product = await this.getProductId(id);
      // if (product) {
      //   // return await product.update(productCreateRequest);
      // }
    } catch (error: any) {
      Logger.error(error.message);
      throw error;
    }
  };

  public deleteProduct = async (id: string) => {
    try {
      const product = await this.getProductId(id);
      // return await product.destroy();
    } catch (error: any) {
      Logger.error(error.message);
      throw error;
    }
  };


  public getProducts = async (
    filter: Filter[],
    order: LpOrder[],
    paging: Paging,
  ) => {
    try {
      const count = await LP_PRODUCT.count({
        where: BuildQuery(filter),
      });
      paging.total = count;

      const results = await LP_PRODUCT.findAll({
        where: BuildQuery(filter),
        offset: GetOffset(paging),
        order: BuildOrderQuery(order),
        limit: paging.limit,
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
  lpProductOptions: LP_PRODUCT_OPTIONCreationAttributes[];
  lpProductOptionPrices: LP_PRODUCT_OPTION_PRICECreationAttributes[];
}
