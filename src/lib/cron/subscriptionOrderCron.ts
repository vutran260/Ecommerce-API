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
  BadRequestError,
  InternalError,
  OutOfStockError,
  PaymentError,
} from '../../lib/http/custom_error/ApiError';
import { CardUsecase } from '../../buyer_site/usecase/CardUsecase';
import { maxDaysRetryAttempts, subCronExpression } from '../../Config';
import { OrderType, SubscriptionStatus } from '../../lib/constant/Constant';
import { MailUseCase } from '../../buyer_site/usecase/MailUsecase';
import {
  LP_ADDRESS_BUYER,
  LP_SUBSCRIPTION,
} from '../../lib/mysql/models/init-models';
import { ErrorCode } from '../../lib/http/custom_error/ErrorCode';
import { CartItem } from '../../buyer_site/endpoint/CartEndpoint';
import { PointConstants } from '../../lib/constant/point/PointConstant';

export class SubscriptionOrderCron {
  private subscriptionRepository: SubscriptionRepository;
  private orderUseCase: OrderUsecase;
  private cardUseCase: CardUsecase;
  private mailUseCase: MailUseCase;

  constructor(
    subscriptionRepository: SubscriptionRepository,
    orderUseCase: OrderUsecase,
    cardUseCase: CardUsecase,
    mailUseCase: MailUseCase,
  ) {
    this.subscriptionRepository = subscriptionRepository;
    this.orderUseCase = orderUseCase;
    this.cardUseCase = cardUseCase;
    this.mailUseCase = mailUseCase;
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
        let pointRate = PointConstants.DEFAULT_POINT_RATE;
        // Check if the subscription starting from the second occurrence
        // then set pointRate to the store's pointRate
        if (sub.subscriptionStatus === SubscriptionStatus.CONTINUE) {
          Logger.info(
            `subscription starting from the second occurrence, set point rate = store's point rate = ${sub.store.pointRate}`,
          );
          pointRate = sub.store.pointRate;
        }
        const order = await this.orderUseCase.createNormalOrder({
          buyerId: sub.buyerId,
          storeId: sub.storeId,
          cardSeq: cards[0].cardSeq,
          cartItems: subProducts,
          latestAddress: subAddress,
          orderType: OrderType.SUBSCRIPTION,
          pointRate,
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

        await this.subscriptionRepository.updateSubscription(
          {
            id: sub.id,
            nextDate,
            subscriptionStatus: SubscriptionStatus.CONTINUE,
            retryAttempts: 0, // Reset retry attempts after successful order
            retryStatus: '', // Clear retry status
          },
          t,
        );

        await t.commit();

        if (order) {
          this.mailUseCase.sendMailOrderSubscription({
            order,
            nextDate,
            subAddress,
          });
        }
      } catch (error) {
        Logger.error('Fail to create order from subscription');
        Logger.error(error);
        await t.rollback();

        const retryAttempts = sub.retryAttempts || 0;
        if (
          error instanceof BadRequestError ||
          error instanceof OutOfStockError ||
          error instanceof PaymentError
        ) {
          return await this.handleRetryOrSkip({
            subscription: sub,
            errorCode: error.errorCode,
            retryAttempts,
            cartItems: subProducts,
            latestAddress: subAddress,
          });
        } else {
          throw error;
        }
      }
    }
  }

  private async handleRetryOrSkip(params: {
    subscription: LP_SUBSCRIPTION;
    errorCode: ErrorCode;
    retryAttempts: number;
    cartItems: CartItem[] | SubscriptionProduct[];
    latestAddress: LP_ADDRESS_BUYER | SubscriptionAddress;
  }) {
    const { subscription, errorCode, retryAttempts, cartItems, latestAddress } =
      params;

    if (retryAttempts < maxDaysRetryAttempts) {
      await this.subscriptionRepository.updateSubscription({
        id: subscription.id,
        retryAttempts: retryAttempts + 1,
        retryStatus: `Retry attempt ${retryAttempts + 1} failed due to ${errorCode}`,
      });

      switch (errorCode) {
        case ErrorCode.OVER_STOCK:
        case ErrorCode.EMPTY_STOCK:
        case ErrorCode.PRODUCT_DELETED:
        case ErrorCode.PRODUCT_INACTIVE:
          await this.mailUseCase.handleSendMailRetry({
            subscription,
            typeError: 'inventory',
            target: 'seller',
          });
          break;
        case ErrorCode.PAYMENT_ERROR:
          await this.mailUseCase.handleSendMailRetry({
            subscription,
            typeError: 'payment',
            target: 'buyer',
          });
          await this.mailUseCase.handleSendMailRetry({
            subscription,
            typeError: 'payment',
            target: 'seller',
          });
          break;
        default:
          break;
      }
    } else {
      const t = await lpSequelize.transaction();
      try {
        const nextDate = moment(subscription.nextDate)
          .add(subscription.subscriptionPeriod, 'days')
          .toDate();
        await this.subscriptionRepository.updateSubscription(
          {
            id: subscription.id,
            nextDate,
            retryAttempts: 0,
            retryStatus: 'Retry attempts exceeded, skipped order',
          },
          t,
        );
        const order = await this.orderUseCase.createSkippedOrder({
          buyerId: subscription.buyerId,
          storeId: subscription.storeId,
          cartItems: cartItems,
          latestAddress: latestAddress,
          orderType: OrderType.SUBSCRIPTION,
          t,
        });

        if (order) {
          await this.subscriptionRepository.createSubscriptionOrder(
            {
              subscriptionId: subscription.id,
              orderId: order.id,
            },
            t,
          );
        }
        await t.commit();

        let isInventoryError = false;
        let isPaymentError = false;
        switch (errorCode) {
          case ErrorCode.OVER_STOCK:
          case ErrorCode.EMPTY_STOCK:
          case ErrorCode.PRODUCT_DELETED:
          case ErrorCode.PRODUCT_INACTIVE:
            isInventoryError = true;
            break;
          case ErrorCode.PAYMENT_ERROR:
            isPaymentError = true;
            break;
          default:
            break;
        }
        await this.mailUseCase.handleSendMailRetry({
          subscription,
          typeError: 'skipped',
          target: 'seller',
          isInventoryError,
          isPaymentError,
        });
        Logger.info(
          `Order skipped for subscription ${subscription.id} after ${maxDaysRetryAttempts} retry attempts`,
        );
      } catch (error) {
        await t.rollback();
        Logger.error(error);
      }
    }
  }
}
