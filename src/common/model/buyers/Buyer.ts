import { IsNotEmpty, IsString } from 'class-validator';
import moment from 'moment';
import { DATE_FORMAT, OrderStatus } from '../../../lib/constant/Constant';
import { LP_BUYER } from '../../../lib/mysql/models/LP_BUYER';

export default class Buyer {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  fullname: string;
}

export class BuyerInfo {
  id: string;
  buyerName?: string;
  phone?: string;
  numOfOrder?: number;
  numOfReturnedOrder?: number;
  latestOrderDate?: string;
  constructor(buyer: LP_BUYER) {
    this.id = buyer.id;
    this.buyerName =
      buyer.lpBuyerPersonalInformation &&
      buyer.lpBuyerPersonalInformation.nickname
        ? buyer.lpBuyerPersonalInformation.nickname
        : '';
    this.phone =
      buyer.lpAddressBuyerSso && buyer.lpAddressBuyerSso.telephoneNumber
        ? buyer.lpAddressBuyerSso.telephoneNumber
        : '';
    if (buyer.lpOrders && buyer.lpOrders.length > 0) {
      this.numOfOrder = buyer.lpOrders.length;

      this.numOfReturnedOrder = buyer.lpOrders.filter(
        (e) => e.orderStatus == OrderStatus.CANCEL,
      ).length;

      const latestDate = buyer.lpOrders
        .map((order) => order?.createdAt)
        .reduce((latest, current) =>
          current && latest
            ? current > latest
              ? current
              : latest
            : new Date(),
        );
      this.latestOrderDate = latestDate
        ? moment(latestDate).format(DATE_FORMAT)
        : '';
    } else {
      this.numOfOrder = 0;
      this.numOfReturnedOrder = 0;
      this.latestOrderDate = '';
    }
  }
}

export class BuyerDetailInfo {
  id: string;
  fullname?: string;
  gender?: number;
  address?: string;
  email?: string;
  telephone?: string;
  constructor(buyer: LP_BUYER) {
    this.id = buyer.id;
    if (buyer.lpBuyerPersonalInformation) {
      const buyerInfo = buyer.lpBuyerPersonalInformation;
      this.fullname = buyerInfo.firstName + ' ' + buyerInfo.lastName;
      this.gender = buyerInfo.gender;
    } else {
      this.fullname = '';
      this.gender = 0;
    }

    if (buyer.lpAddressBuyerSso) {
      const buyerSso = buyer.lpAddressBuyerSso;
      this.address =
        buyerSso.buildingName +
        ', ' +
        buyerSso.cityTown +
        ', ' +
        buyerSso.postCode;
      this.email = buyerSso.email;
      this.telephone = buyerSso.telephoneNumber;
    } else {
      this.address = '';
      this.email = '';
      this.telephone = '';
    }
  }
}
