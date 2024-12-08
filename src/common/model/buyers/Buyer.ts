import { IsNotEmpty, IsString } from 'class-validator';
import moment from 'moment';
import { DATE_FORMAT, OrderStatus } from '../../../lib/constant/Constant';
import { LP_BUYER } from '../../../lib/mysql/models/LP_BUYER';
import { formatNameKanjiAndKana } from '../../../lib/helpers/commonFunction';

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
    const buyerAddress =
      buyer?.lpAddressBuyers?.[0] || buyer?.lpAddressBuyerSso;
    if (buyerAddress) {
      this.buyerName = formatNameKanjiAndKana(
        buyerAddress.firstNameKanji,
        buyerAddress.lastNameKanji,
        buyerAddress.firstNameKana,
        buyerAddress.lastNameKana,
      );
      this.phone = buyerAddress.telephoneNumber;
    } else {
      this.buyerName = '-';
      this.phone = '-';
    }
    this.id = buyer.id;
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
    const buyerAddress =
      buyer?.lpAddressBuyers?.[0] || buyer?.lpAddressBuyerSso;
    if (buyerAddress) {
      this.fullname = formatNameKanjiAndKana(
        buyerAddress.firstNameKanji,
        buyerAddress.lastNameKanji,
        buyerAddress.firstNameKana,
        buyerAddress.lastNameKana,
      );
      this.gender = buyerAddress.gender;
      this.address = [
        buyerAddress.prefectureName || buyerAddress.prefectureCode,
        buyerAddress.cityTown,
        buyerAddress.streetAddress,
        buyerAddress.buildingName,
      ]
        .filter(Boolean)
        .join(', ');
      this.email = buyerAddress.email;
      this.telephone = buyerAddress.telephoneNumber;
    } else {
      this.address = '';
      this.email = '';
      this.telephone = '';
      this.fullname = '';
      this.gender = 0;
    }
  }
}
