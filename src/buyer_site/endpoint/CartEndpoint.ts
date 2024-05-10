import express, { Response } from 'express';
import { ProtectedRequest } from '../../lib/http/app-request';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { validatorRequest } from '../../lib/helpers/validate';
import { LP_CART, LP_CARTAttributes } from '../../lib/mysql/models/LP_CART';
import { booleanToTINYINT } from '../../lib/helpers/utils';
import moment from 'moment';
import { DATE_FORTMAT } from '../../lib/constant/Constant';
import { CartUsecase } from '../usecase/CartUsecase';
import { ResponseData, ResponseListData } from '../../lib/http/Response';
import Logger from '../../lib/core/Logger';
import { string } from 'joi';

export class CartEndpoint {
  private cartUsecase: CartUsecase;

  constructor(cartUsecase: CartUsecase) {
    this.cartUsecase = cartUsecase;
  }

  private addProduct = async (req: ProtectedRequest, res: Response) => {
    const addProductRequest = plainToInstance(ProductRequest, req.body);
    addProductRequest.buyerId = req.user.id;
    addProductRequest.storeId = req.storeId;

    await validatorRequest(addProductRequest);
    await this.cartUsecase.addProduct(addProductRequest);

    return ResponseData("add product success!!!", res);
  };
  private updateProduct = async (req: ProtectedRequest, res: Response) => {
    const updateProductRequest = plainToInstance(ProductRequest, req.body);
    updateProductRequest.buyerId = req.user.id;
    updateProductRequest.storeId = req.storeId;
    await validatorRequest(updateProductRequest);
    await this.cartUsecase.updateProduct(updateProductRequest);
    return ResponseData("update product success!!!", res);
  }

  private deleteProduct = async (req: ProtectedRequest, res: Response) => {
    const buyerId: string = req.user.id
    const storeId: string = req.storeId
    const id: string = req.params.id;
    await this.cartUsecase.deleteProduct(id, buyerId, storeId);
    return ResponseData({ message: 'Deleted is successfully!' }, res);

  }

  private getCart = async (req: ProtectedRequest, res: Response) => {
    const storeId: string = req.params.storeId
    const buyerId: string = req.params.buyerId
    const results = await this.cartUsecase.getCart(storeId, buyerId);
    return ResponseData(results, res)
  }

  private deleteProducts = async (req: ProtectedRequest, res: Response) => {
    const storeId: string = req.storeId
    const buyerId: string = req.user.id
    const ids: string[] = req.body.ids;
    await this.cartUsecase.deleteProducts(ids, storeId, buyerId);
    return ResponseData({ message: 'Deleted is successfully!' }, res);
  }





  public getRouter() {
    const router = express.Router();

    router.post('/addProduct', this.addProduct);
    router.get('/:storeId/:buyerId', this.getCart)
    router.delete('/delete/:id', this.deleteProduct);
    router.delete('/products', this.deleteProducts)
    router.put('/', this.updateProduct)
    return router;
  }
}

export class ProductRequest {
  @IsString()
  @IsNotEmpty()
  buyerId: string;

  @IsString()
  @IsNotEmpty()
  storeId: string;

  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsBoolean()
  @IsNotEmpty()
  isSubscription: boolean;

  buyingTimeOption: number;
  buyingPeriod: number;
  startBuyingDate: string;

  public ToLP_CART(): LP_CARTAttributes {
    const startBuyingDate = this.startBuyingDate ? moment(this.startBuyingDate, DATE_FORTMAT).toDate() : undefined;
    return {
      buyerId: this.buyerId,
      storeId: this.storeId,
      productId: this.productId,
      quantity: this.quantity,
      buyingTimeOption: this.buyingTimeOption,
      buyingPeriod: this.buyingPeriod,
      isSubscription: booleanToTINYINT(this.isSubscription)!,
      startBuyingDate: startBuyingDate,
    };
  }
}

export const ProductRequestToLP_CART = (
  input: ProductRequest,
): LP_CARTAttributes => {
  const startBuyingDate = moment(input.startBuyingDate, DATE_FORTMAT).toDate();

  return {
    buyerId: input.buyerId,
    storeId: input.storeId,
    productId: input.productId,
    quantity: input.quantity,
    buyingTimeOption: input.buyingTimeOption,
    buyingPeriod: input.buyingPeriod,
    isSubscription: booleanToTINYINT(input.isSubscription)!,
    startBuyingDate: startBuyingDate,
  };
};
