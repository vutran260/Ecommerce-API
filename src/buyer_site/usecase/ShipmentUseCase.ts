import { ShipmentPrice } from '../../lib/constant/Constant';

export class ShipmentUseCase {
  constructor() {}

  public calculateShipmentFee(params: { totalAmount: number }): number {
    const { totalAmount } = params;
    return totalAmount > ShipmentPrice.MAX_PRICE_APPY_FEE
      ? ShipmentPrice.MIN_FEE
      : ShipmentPrice.MAX_FEE;
  }
}
