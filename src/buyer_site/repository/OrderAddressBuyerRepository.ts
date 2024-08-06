import { Transaction } from 'sequelize';
import { OrderAddressBuyerCreate } from '../../common/model/orders/Order';
import { LP_ORDER_ADDRESS_BUYER } from '../../lib/mysql/models/LP_ORDER_ADDRESS_BUYER';

export class OrderAddressBuyerRepository {
  public addAddress = async (
    input: OrderAddressBuyerCreate,
    t?: Transaction,
  ) => {
    await LP_ORDER_ADDRESS_BUYER.create(input, {
      transaction: t,
    });
  };
}
