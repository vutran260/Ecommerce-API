import base64url from 'base64url';
import { PaginationRequest } from './Request';
import { Order, OrderItem } from 'sequelize';

export declare interface LpOrder {
  attribute: string;
  direction: string;
}

export const BuildOrderQuery = (orders: LpOrder[]): Order => {
  if (!orders) {
    return [];
  }
  return orders.map((order) => lpOrder2SequeLizeOrder(order));
};

const lpOrder2SequeLizeOrder = (order: LpOrder): OrderItem => {
  return [order.attribute, order.direction];
};

export const GetOrder = (req: PaginationRequest) => {
  const rawOrder = req.header('order');
  if (!rawOrder) {
    return (req.order = []);
  }
  const jsonOrder = base64url.decode(rawOrder);
  req.order = JSON.parse(jsonOrder);
};
