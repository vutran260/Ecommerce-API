import ProductCreateRequest from '../requests/products/ProductCreateRequest';
import Logger from '../../lib/core/Logger';
import { NotFoundError } from '../../lib/http/custom_error/ApiError';
import {
  BuildQuery,
  Filter,
  GetOffset,
  Paging,
} from '../../lib/paging/Request';
import { LP_PRODUCT, LP_PRODUCTAttributes, LP_PRODUCTCreationAttributes } from '../../lib/mysql/models/LP_PRODUCT';
import { BuildOrderQuery, LpOrder } from '../../lib/paging/Order';
import { LP_PRODUCT_COMPONENTCreationAttributes } from '../../lib/mysql/models/LP_PRODUCT_COMPONENT';
import { LP_PRODUCT_OPTIONCreationAttributes } from '../../lib/mysql/models/LP_PRODUCT_OPTION';
import { LP_PRODUCT_OPTION_PRICECreationAttributes } from '../../lib/mysql/models/LP_PRODUCT_OPTION_PRICE';

export class ProductRepository {

  public createProduct = async (input: CreateProductInput): Promise<void> => {

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
  };

  public updateProduct = async (
    productCreateRequest: ProductCreateRequest,
    id: string,
  ) => {
    try {
      const product = await this.getProductId(id);
      if (product) {
        return await product.update(productCreateRequest);
      }
    } catch (error: any) {
      Logger.error(error.message);
      throw error;
    }
  };

  public deleteProduct = async (id: string) => {
    try {
      const product = await this.getProductId(id);
      return await product.destroy();
    } catch (error: any) {
      Logger.error(error.message);
      throw error;
    }
  };

  public getProductId = async (id: string) => {
    const result: any = await LP_PRODUCT.findByPk(id);
    if (result) {
      return result;
    } else {
      throw new NotFoundError();
    }
  };

  public getProducts = async (filter: Filter[], order: LpOrder[], paging: Paging) => {
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


export interface CreateProductInput extends LP_PRODUCTCreationAttributes{
  lpProductComponents: LP_PRODUCT_COMPONENTCreationAttributes[];
  lpProductOptions: LP_PRODUCT_OPTIONCreationAttributes[];
  lpProductOptionPrices: LP_PRODUCT_OPTION_PRICECreationAttributes[];
}
