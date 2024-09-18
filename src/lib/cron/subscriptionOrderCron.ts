import cron from 'node-cron';
import { SubscriptionRepository } from '../../buyer_site/repository/SubscriptionRepository';
import { OrderUsecase } from '../../buyer_site/usecase/OrderUsecase';
import { isEmpty } from 'lodash';
import { lpSequelize } from '../../lib/mysql/Connection';
import {
  SubscriptionAddress,
  SubscriptionProduct,
} from '../../common/model/orders/Subscription';
import Logger from '../../lib/core/Logger';
import moment from 'moment';
import {
  InternalError,
  OutOfStockError,
} from '../../lib/http/custom_error/ApiError';
import { CardUsecase } from '../../buyer_site/usecase/CardUsecase';
import { subCronExpression } from '../../Config';
import { OrderRepository } from '../../buyer_site/repository/OrderRepository';
import {
  formatCurrency,
  formatPhoneNumber,
} from '../../lib/helpers/commonFunction';
import {
  MailService,
  OrderSubscriptionSuccessOptions,
} from '../../third_party/mail/mailService';
import { formatDateJp } from '../../lib/helpers/dateTimeUtil';
import { OrderType } from '../../lib/constant/Constant';

export class SubscriptionOrderCron {
  private subscriptionRepository: SubscriptionRepository;
  private orderRepository: OrderRepository;
  private orderUseCase: OrderUsecase;
  private cardUseCase: CardUsecase;
  private mailService: MailService;

  constructor(
    subscriptionRepository: SubscriptionRepository,
    orderRepository: OrderRepository,
    orderUseCase: OrderUsecase,
    cardUseCase: CardUsecase,
    mailService: MailService,
  ) {
    this.subscriptionRepository = subscriptionRepository;
    this.orderRepository = orderRepository;
    this.orderUseCase = orderUseCase;
    this.cardUseCase = cardUseCase;
    this.mailService = mailService;
  }

  public start() {
    cron.schedule(subCronExpression, async () => {
      await this.processSubscriptionOrders();
    });
  }

  private async processSubscriptionOrders() {
    Logger.info(`Start finding subscription`);
    const subscriptions =
      await this.subscriptionRepository.getSubscriptionsByNextDate();

    if (isEmpty(subscriptions)) {
      return;
    }

    for (const sub of subscriptions) {
      Logger.info(`Start create order from subscription: ${sub.id}`);
      const subProducts = sub.lpSubscriptionProducts.map((item) => {
        return SubscriptionProduct.FromLP_SUBSCRIPTION_PRODUCT(item);
      });

      const subAddress = SubscriptionAddress.FromLP_SUBSCRIPTION_ADDRESS(
        sub.lpSubscriptionAddress,
      );

      const cards = await this.cardUseCase.getCards(sub.buyerId);
      if (!cards || isEmpty(cards)) {
        Logger.error(`Buyer id ${sub.buyerId} has no card yet!`);
        return;
      }

      const t = await lpSequelize.transaction();
      try {
        const order = await this.orderUseCase.createNormalOrder({
          buyerId: sub.buyerId,
          storeId: sub.storeId,
          cardSeq: cards[0].cardSeq,
          cartItems: subProducts,
          latestAddress: subAddress,
          orderType: OrderType.SUBSCRIPTION,
          t,
        });

        if (!order) {
          throw new InternalError('Failed to create order from subscription');
        }

        Logger.info(`Start create subscription, orderId = ${order.id}`);
        await this.subscriptionRepository.createSubscriptionOrder(
          {
            subscriptionId: sub.id,
            orderId: order?.id,
          },
          t,
        );

        Logger.info(`Start update next date = next date + period`);
        const nextDate = moment(sub.nextDate)
          .add(sub.subscriptionPeriod, 'days')
          .toDate();
        await this.subscriptionRepository.updateNextDate(sub.id, nextDate, t);

        await t.commit();

        if (order) {
          const orderNewest = await this.orderRepository.getOrderFullAttrById(
            order.id,
          );
          const products =
            orderNewest?.lpOrderItems?.map((item) => {
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
              subTotal: formatCurrency(orderNewest?.amount),
              shippingCode: formatCurrency(orderNewest?.shipmentFee),
              total: formatCurrency(orderNewest?.totalAmount),
              postCode: subAddress.postCode,
              address: `${subAddress.prefectureName || ''} ${subAddress.cityTown} ${subAddress.streetAddress} ${subAddress.buildingName}`,
              phoneNumber: formatPhoneNumber(subAddress.telephoneNumber),
            },
          };
          Logger.info(
            `Start send mail order success with options: ${JSON.stringify(mailOptions, null, 2)}`,
          );
          this.mailService.sendMail(mailOptions);
        }
      } catch (error) {
        Logger.error('Fail to create order from subscription');
        Logger.error(error);
        await t.rollback();
        if (error instanceof OutOfStockError) {
          Logger.info(`Out of stock error, start update next date`);
          const nextDate = moment(sub.nextDate)
            .add(sub.subscriptionPeriod, 'days')
            .toDate();
          await this.subscriptionRepository.updateNextDate(sub.id, nextDate);
        }
      }
    }
  }
}
