import express, { Response } from 'express';
import { ProtectedRequest } from '../../lib/http/app-request';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { validatorRequest } from '../../lib/helpers/validate';
import { LP_CART, LP_CARTAttributes } from '../../lib/mysql/models/LP_CART';
import { TINYINTToBoolean, booleanToTINYINT } from '../../lib/helpers/utils';
import moment from 'moment';
import { DATE_FORMAT } from '../../lib/constant/Constant';
import { CartUsecase } from '../usecase/CartUsecase';
import { ResponseData } from '../../lib/http/Response';
import Product, { ProductFromLP_PRODUCT } from '../../common/model/products/Product';
import { IsYYYYMMDD } from '../../common/custom_validator/IsYYYYMMDD';

export class CartEndpoint {
  private cartUsecase: CartUsecase;

  constructor(cartUsecase: CartUsecase) {
    this.cartUsecase = cartUsecase;
  }

  private addItem = async (req: ProtectedRequest, res: Response) => {
    const addItemRequest = plainToInstance(CartItem, req.body);
    addItemRequest.buyerId = req.user.id;
    addItemRequest.storeId = req.storeId;

    await validatorRequest(addItemRequest);
    await this.cartUsecase.addItem(addItemRequest);

    return ResponseData("add product success!!!", res);
  };
  private updateItem = async (req: ProtectedRequest, res: Response) => {
    const updateItemRequest = plainToInstance(CartItem, req.body);
    updateItemRequest.buyerId = req.user.id;
    updateItemRequest.storeId = req.storeId;

    await validatorRequest(updateItemRequest);
    await this.cartUsecase.updateItem(updateItemRequest);
    return ResponseData("update product success!!!", res);
  }

  private deleteItem = async (req: ProtectedRequest, res: Response) => {
    const id: string = req.params.id;
    await this.cartUsecase.deleteItem(id);
    return ResponseData({ message: 'Deleted is successfully!' }, res);

  }

  private getCart = async (req: ProtectedRequest, res: Response) => {
    const storeId: string = req.storeId
    const buyerId: string = req.user.id
    const results = await this.cartUsecase.getListItemInCart(storeId, buyerId);
    return ResponseData(results, res)
  }

  private deleteItems = async (req: ProtectedRequest, res: Response) => {
    const ids: string[] = req.body.ids;
    await this.cartUsecase.deleteItems(ids);
    return ResponseData({ message: 'Deleted is successfully!' }, res);
  }





  public getRouter() {
    const router = express.Router();

    router.post('/', this.addItem);
    router.get('/', this.getCart)
    router.delete('/:id', this.deleteItem);
    router.delete('/', this.deleteItems)
    router.put('/', this.updateItem)
    return router;
  }
}

export class CartItem {
  id: string

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

  buyingPeriod?: number;

  @IsYYYYMMDD()
  startBuyingDate: string;

  product: Product;

  public ToLP_CART(): LP_CARTAttributes {
    const startBuyingDate = this.startBuyingDate ? moment(this.startBuyingDate, DATE_FORMAT).toDate() : undefined;
    return {
      id: this.id,
      buyerId: this.buyerId,
      storeId: this.storeId,
      productId: this.productId,
      quantity: this.quantity,
      buyingPeriod: this.buyingPeriod,
      isSubscription: booleanToTINYINT(this.isSubscription)!,
      startBuyingDate: startBuyingDate,
    };
  }

  static FromLP_CART(lpCart: LP_CART) {
    const item = new CartItem();
    item.id = lpCart.id;
    item.buyerId = lpCart.buyerId;
    item.storeId = lpCart.storeId;
    item.productId = lpCart.productId;
    item.quantity = lpCart.quantity;
    item.isSubscription = TINYINTToBoolean(lpCart.isSubscription);
    item.buyingPeriod = lpCart.buyingPeriod;
    item.startBuyingDate = moment(lpCart.startBuyingDate).format(DATE_FORMAT);

    item.product = ProductFromLP_PRODUCT(lpCart.product);
    return item;
  }

}