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
  formatPoint,
} from '../../lib/helpers/commonFunction';
import {
  SubscriptionAddress,
  SubscriptionProduct,
} from '../../common/model/orders/Subscription';
import { CreateOrderItemRequest } from '../../common/model/orders/Order';
import { ShipmentUseCase } from '../../buyer_site/usecase/ShipmentUseCase';

export class MailUseCase {
  private orderRepo: OrderRepository;
  private mailService: MailService;
  private shipmentUseCase: ShipmentUseCase;

  constructor(
    orderRepo: OrderRepository,
    mailService: MailService,
    shipmentUseCase: ShipmentUseCase,
  ) {
    this.orderRepo = orderRepo;
    this.mailService = mailService;
    this.shipmentUseCase = shipmentUseCase;
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
        pointUse: formatPoint(order?.pointUse),
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
    timezone: string;
  }) => {
    const { order, reasons, canceledAt, timezone } = params;
    const { lpOrderAddressBuyer } = order;

    const mailOptions = {
      to: lpOrderAddressBuyer?.email,
      subject: 'ECパレット｜ご注文のキャンセルが完了しました',
      templateName: 'orderCancelBuyer',
      params: {
        buyerFirstNameKanji: lpOrderAddressBuyer.firstNameKanji,
        buyerLastNameKanji: lpOrderAddressBuyer.lastNameKanji,
        orderId: order.id,
        orderCreatedAt: formatDateTimeJp(order.createdAt, timezone),
        orderCanceledAt: formatDateTimeJp(canceledAt, timezone),
        cancelReasons: reasons,
      },
    };

    this.mailService.sendMail(mailOptions);
  };

  public sendMailSellerCancelOrder = async (params: {
    order: LP_ORDER;
    canceledAt: Date;
    reasons: string[];
    timezone: string;
  }) => {
    const { order, reasons, canceledAt, timezone } = params;
    const { lpOrderAddressBuyer } = order;

    const mailOptions = {
      to: lpOrderAddressBuyer?.email,
      subject: 'ECパレット｜ご注文のキャンセルについて',
      templateName: 'orderCancelSeller',
      params: {
        buyerFirstNameKanji: lpOrderAddressBuyer.firstNameKanji,
        buyerLastNameKanji: lpOrderAddressBuyer.lastNameKanji,
        orderId: order.id,
        orderCreatedAt: formatDateTimeJp(order.createdAt, timezone),
        orderCanceledAt: formatDateTimeJp(canceledAt, timezone),
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

  public handleSendMailRetry = async (params: {
    subscription: LP_SUBSCRIPTION;
    typeError: 'inventory' | 'payment' | 'skipped';
    target: 'seller' | 'buyer';
    isInventoryError?: boolean;
    isPaymentError?: boolean;
  }) => {
    const {
      subscription,
      typeError,
      target,
      isInventoryError,
      isPaymentError,
    } = params;
    const { lpSubscriptionAddress: subAddress, lpSubscriptionProducts } =
      subscription;

    const products =
      lpSubscriptionProducts?.map((item) => {
        return {
          productName: item.product.productName,
          unitPrice: formatCurrency(item.product?.priceSubscription),
          quantity: item.quantity,
          subTotal: formatCurrency(
            (item.product?.priceSubscription || 0) * item.quantity,
          ),
        };
      }) || [];

    const subProducts = subscription.lpSubscriptionProducts.map((item) => {
      return SubscriptionProduct.FromLP_SUBSCRIPTION_PRODUCT(item);
    });

    const subTotal = this.calculateTotalAmount(subProducts);
    const shipmentFee = this.shipmentUseCase.calculateShipmentFee({
      totalAmount: subTotal,
    });
    const totalAmount = subTotal + shipmentFee;

    let templateName = '';
    let subject = '';
    switch (typeError) {
      case 'inventory':
        templateName = 'subscriptionInventoryErrorForSeller';
        subject = 'ECパレット｜件名: 在庫による注文生成エラーのご連絡';
        break;
      case 'payment':
        if (target === 'seller') {
          templateName = 'subscriptionPaymentErrorForSeller';
        } else {
          templateName = 'subscriptionPaymentErrorForBuyer';
        }
        subject = 'ECパレット｜件名: 在庫による注文生成エラーのご連絡';
        break;
      case 'skipped':
        if (target === 'seller') {
          templateName = 'subscriptionSkippedOrderForSeller';
        } else {
          templateName = 'subscriptionSkippedErrorForBuyer';
        }
        subject = 'ECパレット｜件名: 注文生成スキップエラーのご連絡';
        break;
    }

    let toMail = '';
    if (target === 'seller') {
      toMail = subscription.store.lpSellers[0].email || '';
    } else {
      toMail = subAddress.email;
    }

    const mailParams = {
      buyerFirstNameKanji: subAddress.firstNameKanji,
      buyerLastNameKanji: subAddress.lastNameKanji,
      subscriptionId: subscription.id,
      subscriptionCreatedAt: formatDateTimeJp(subscription.createdAt),
      nextDeliveryDate: formatDateJp(subscription.nextDate),
      products: products,
      subTotal: formatCurrency(subTotal),
      shippingCost: formatCurrency(shipmentFee),
      total: formatCurrency(totalAmount),
      postCode: subAddress.postCode,
      address: `${subAddress.prefectureName || ''} ${subAddress.cityTown} ${subAddress.streetAddress} ${subAddress.buildingName}`,
      phoneNumber: formatPhoneNumber(subAddress.telephoneNumber),
      isInventoryError,
      isPaymentError,
    };

    const mailOptions = {
      to: toMail,
      subject: subject,
      templateName: templateName,
      params: mailParams,
    };

    this.mailService.sendMail(mailOptions);
  };

  public sendMailRequestApproveSpecialOrder = async (params: {
    orderId: number;
  }) => {
    const { orderId } = params;
    const order = await this.orderRepo.getOrderFullAttrById(orderId);
    if (!order) {
      return;
    }
    const mailOptions = {
      to: order?.store?.lpSellers[0].email || '',
      subject: 'ECパレット｜ご注文ありがとうございます',
      templateName: 'orderSpecialRequestApprove',
      params: {},
    };
    console.log('mailOptions', mailOptions);
    this.mailService.sendMail(mailOptions);
  };

  private calculateTotalAmount(products: SubscriptionProduct[]): number {
    let totalAmount = 0;
    for (const product of products) {
      const input = new CreateOrderItemRequest(product);
      input.originalPrice = product.product.priceSubscription || 0;
      if (!input.price || input.price <= 0) {
        return 0;
      }
      totalAmount += input.price * input.quantity;
    }
    return totalAmount;
  }
}
