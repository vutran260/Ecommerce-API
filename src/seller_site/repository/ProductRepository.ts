import ProductCreateRequest from '../../admin_site/requests/products/ProductCreateRequest';
import Logger from '../../lib/core/Logger';
import { NotFoundError } from '../../lib/http/custom_error/ApiError';
import {
  BuildQuery,
  Filter,
  GetOffset,
  Paging,
} from '../../lib/paging/Request';
import { LP_PRODUCT } from '../../lib/mysql/models/LP_PRODUCT';

export class ProductRepository {

  public createProduct = async (productCreateRequest: ProductCreateRequest) => {
    try {
      const results: any = await LP_PRODUCT.create(productCreateRequest)
        .then((pro) => {
          return pro.dataValues;
        })
        .catch((err) => {
          throw err;
        });
      return results;
    } catch (error: any) {
      Logger.error(error.message);
      throw error;
    }
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

  public getProducts = async (filter: Filter[], paging: Paging) => {
    try {
      const count = await LP_PRODUCT.count({
        where: BuildQuery(filter),
      });
      paging.total = count;

      const results = await LP_PRODUCT.findAll({
        where: BuildQuery(filter),
        offset: GetOffset(paging),
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
