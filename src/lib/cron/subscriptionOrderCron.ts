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
import { OrderType } from '../../lib/constant/Constant';
import { MailUseCase } from '../../buyer_site/usecase/MailUsecase';

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
