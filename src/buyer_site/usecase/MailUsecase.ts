import Logger from '../../lib/core/Logger';
import { OrderRepository } from '../repository/OrderRepository';
import {
  LP_ADDRESS_BUYER,
  LP_ORDER,
  LP_SUBSCRIPTION,
  LP_SUBSCRIPTION_ADDRESS,
} from '../../lib/mysql/models/init-models';
import {
  MailService,
  OrderSubscriptionSuccessOptions,
  OrderSuccessOptions,
} from '../../third_party/mail/mailService';
import { formatDateJp, formatDateTimeJp } from '../../lib/helpers/dateTimeUtil';
import {
  formatCurrency,
  formatPhoneNumber,
} from '../../lib/helpers/commonFunction';
import { SubscriptionAddress } from '../../common/model/orders/Subscription';

export class MailUseCase {
  private orderRepo: OrderRepository;
  private mailService: MailService;

  constructor(orderRepo: OrderRepository, mailService: MailService) {
    this.orderRepo = orderRepo;
    this.mailService = mailService;
  }

  public sendMailOrder = async (params: {
    orderId: number;
    latestAddress: LP_ADDRESS_BUYER;
  }) => {
    const { orderId, latestAddress } = params;
    const order = await this.orderRepo.getOrderFullAttrById(orderId);
    if (!order) {
      return;
    }

    const products =
      order?.lpOrderItems?.map((item) => {
        return {
          productName: item.productName,
          unitPrice: formatCurrency(item.price),
          quantity: item.quantity,
          subTotal: formatCurrency((item.price || 0) * item.quantity),
        };
      }) || [];
    const mailOptions: OrderSuccessOptions = {
      to: latestAddress.email,
      subject: 'ECパレット｜ご注文ありがとうございます',
      templateName: 'orderSuccessTemplate',
      params: {
        buyerFirstNameKanji: latestAddress.firstNameKanji,
        buyerLastNameKanji: latestAddress.lastNameKanji,
        companyName: 'ECパレット',
        orderId: order.id,
        orderCreatedAt: formatDateJp(order.createdAt),
        products: products,
        subTotal: formatCurrency(order?.amount),
        shippingCode: formatCurrency(order?.shipmentFee),
        total: formatCurrency(order?.totalAmount),
        postCode: latestAddress.postCode,
        address: `${latestAddress.prefectureName || ''} ${latestAddress.cityTown} ${latestAddress.streetAddress} ${latestAddress.buildingName}`,
        phoneNumber: formatPhoneNumber(latestAddress.telephoneNumber),
      },
    };
    Logger.info(
      `Start send mail order success with options: ${JSON.stringify(mailOptions, null, 2)}`,
    );

    this.mailService.sendMail(mailOptions);
  };

  public sendMailOrderSubscription = async (params: {
    order: LP_ORDER;
    nextDate: Date;
    subAddress: LP_SUBSCRIPTION_ADDRESS | SubscriptionAddress;
  }) => {
    const { order, subAddress, nextDate } = params;

    const products =
      order?.lpOrderItems?.map((item) => {
        return {
          productName: item.productName,
          unitPrice: formatCurrency(item.price),
          quantity: item.quantity,
          subTotal: formatCurrency((item.price || 0) * item.quantity),
        };
      }) || [];

    const mailOptions: OrderSubscriptionSuccessOptions = {
      to: subAddress.email,
      subject: 'ECパレット｜ご注文ありがとうございます',
      templateName: 'orderSubscriptionSuccessTemplate',
      params: {
        buyerFirstNameKanji: subAddress.firstNameKanji,
        buyerLastNameKanji: subAddress.lastNameKanji,
        companyName: 'ECパレット',
        orderId: order.id,
        orderCreatedAt: formatDateJp(order.createdAt),
        nextDeliveryDate: formatDateJp(nextDate),
        products: products,
        subTotal: formatCurrency(order?.amount),
        shippingCode: formatCurrency(order?.shipmentFee),
        total: formatCurrency(order?.totalAmount),
        postCode: subAddress.postCode,
        address: `${subAddress.prefectureName || ''} ${subAddress.cityTown} ${subAddress.streetAddress} ${subAddress.buildingName}`,
        phoneNumber: formatPhoneNumber(subAddress.telephoneNumber),
      },
    };

    Logger.info(
      `Start send mail order success with options: ${JSON.stringify(mailOptions, null, 2)}`,
    );

    this.mailService.sendMail(mailOptions);
  };

  public sendMailBuyerCancelOrder = async (params: {
    order: LP_ORDER;
    canceledAt: Date;
    reasons: string[];
  }) => {
    const { order, reasons, canceledAt } = params;
    const { lpOrderAddressBuyer } = order;

    const mailOptions = {
      to: lpOrderAddressBuyer?.email,
      subject: 'ECパレット｜ご注文のキャンセルが完了しました',
      templateName: 'orderCancelBuyer',
      params: {
        buyerFirstNameKanji: lpOrderAddressBuyer.firstNameKanji,
        buyerLastNameKanji: lpOrderAddressBuyer.lastNameKanji,
        orderId: order.id,
        orderCreatedAt: formatDateTimeJp(order.createdAt),
        orderCanceledAt: formatDateTimeJp(canceledAt),
        cancelReasons: reasons,
      },
    };

    this.mailService.sendMail(mailOptions);
  };

  public sendMailSellerCancelOrder = async (params: {
    order: LP_ORDER;
    canceledAt: Date;
    reasons: string[];
  }) => {
    const { order, reasons, canceledAt } = params;
    const { lpOrderAddressBuyer } = order;

    const mailOptions = {
      to: lpOrderAddressBuyer?.email,
      subject: 'ECパレット｜ご注文のキャンセルについて',
      templateName: 'orderCancelSeller',
      params: {
        buyerFirstNameKanji: lpOrderAddressBuyer.firstNameKanji,
        buyerLastNameKanji: lpOrderAddressBuyer.lastNameKanji,
        orderId: order.id,
        orderCreatedAt: formatDateTimeJp(order.createdAt),
        orderCanceledAt: formatDateTimeJp(canceledAt),
        cancelReasons: reasons,
      },
    };

    this.mailService.sendMail(mailOptions);
  };

  public sendMailBuyerCancelSubscription = async (params: {
    subscription: LP_SUBSCRIPTION;
    canceledAt: Date;
    reasons: string[];
  }) => {
    const { subscription, reasons, canceledAt } = params;
    const { lpSubscriptionAddress } = subscription;

    const mailOptions = {
      to: lpSubscriptionAddress?.email,
      subject: 'ECパレット｜定期便の解約について',
      templateName: 'subscriptionCancelBuyer',
      params: {
        buyerFirstNameKanji: lpSubscriptionAddress.firstNameKanji,
        buyerLastNameKanji: lpSubscriptionAddress.lastNameKanji,
        subscriptionId: subscription.id,
        subscriptionCreatedAt: formatDateTimeJp(subscription.createdAt),
        orderCanceledAt: formatDateTimeJp(canceledAt),
        cancelReasons: reasons,
      },
    };

    this.mailService.sendMail(mailOptions);
  };

  public sendMailSellerCancelSubscription = async (params: {
    subscription: LP_SUBSCRIPTION;
    canceledAt: Date;
    reasons: string[];
  }) => {
    const { subscription, reasons, canceledAt } = params;
    const { lpSubscriptionAddress } = subscription;

    const mailOptions = {
      to: lpSubscriptionAddress?.email,
      subject: 'ECパレット｜定期便の解約について',
      templateName: 'subscriptionCancelSeller',
      params: {
        buyerFirstNameKanji: lpSubscriptionAddress.firstNameKanji,
        buyerLastNameKanji: lpSubscriptionAddress.lastNameKanji,
        subscriptionId: subscription.id,
        subscriptionCreatedAt: formatDateTimeJp(subscription.createdAt),
        orderCanceledAt: formatDateTimeJp(canceledAt),
        cancelReasons: reasons,
      },
    };

    this.mailService.sendMail(mailOptions);
  };
}
