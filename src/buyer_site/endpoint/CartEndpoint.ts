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
import { ResponseData } from '../../lib/http/Response';

export class CartEndpoint {
  private cartUsecase: CartUsecase;

  constructor(cartUsecase: CartUsecase) {
    this.cartUsecase = cartUsecase;
  }

  private addProduct = async (req: ProtectedRequest, res: Response) => {
    const addProductRequest = plainToInstance(AddProductRequest, req.body);
    addProductRequest.buyerId = req.user.id;
    addProductRequest.storeId = req.storeId;

    await validatorRequest(addProductRequest);
    await this.cartUsecase.addProduct(addProductRequest);

    return ResponseData("add product success!!!", res);
  };

  public getRouter() {
    const router = express.Router();
    router.post('/addProduct', this.addProduct);
    return router;
  }
}

export class AddProductRequest {
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
    const startBuyingDate =  this.startBuyingDate? moment(this.startBuyingDate, DATE_FORTMAT).toDate(): undefined;
    return {
      buyerId: this.buyerId,
      storeId: this.storeId,
      productId: this.productId,
      quantity: this.quantity,
      buyingTimeOption: this.buyingTimeOption,
      buyingPeriod: this.buyingPeriod,
      isSubscription: booleanToTINYINT(this.isSubscription),
      startBuyingDate: startBuyingDate,
    };
  }
}

export const AddProductRequestToLP_CART = (
  input: AddProductRequest,
): LP_CARTAttributes => {
  const startBuyingDate = moment(input.startBuyingDate, DATE_FORTMAT).toDate();

  return {
    buyerId: input.buyerId,
    storeId: input.storeId,
    productId: input.productId,
    quantity: input.quantity,
    buyingTimeOption: input.buyingTimeOption,
    buyingPeriod: input.buyingPeriod,
    isSubscription: booleanToTINYINT(input.isSubscription),
    startBuyingDate: startBuyingDate,
  };
};
