import { Op, Transaction } from 'sequelize';
import {
  CreateSubscriptionAddressRequest,
  CreateSubscriptionOrderRequest,
  CreateSubscriptionProductRequest,
  CreateSubscriptionRequest,
} from '../../common/model/orders/Subscription';
import {
  LP_SUBSCRIPTION,
  LP_SUBSCRIPTION_ADDRESS,
  LP_SUBSCRIPTION_ORDER,
  LP_SUBSCRIPTION_PRODUCT,
} from '../../lib/mysql/models/init-models';
import { SubscriptionStatus } from '../../lib/constant/Constant';
import { daysBeforeNextDate } from '../../Config';

export class SubscriptionRepository {
  public createSubscription = async (
    createSubscriptionRequest: CreateSubscriptionRequest,
    t?: Transaction,
  ) => {
    return await LP_SUBSCRIPTION.create(createSubscriptionRequest, {
      transaction: t,
    });
  };

  public async createSubscriptionProduct(
    createSubscriptionProductRequest: CreateSubscriptionProductRequest,
    t?: Transaction,
  ): Promise<LP_SUBSCRIPTION_PRODUCT> {
    return await LP_SUBSCRIPTION_PRODUCT.create(
      createSubscriptionProductRequest,
      {
        transaction: t,
      },
    );
  }

  public async createSubscriptionAddress(
    createSubscriptionAddressRequest: CreateSubscriptionAddressRequest,
    t?: Transaction,
  ): Promise<LP_SUBSCRIPTION_ADDRESS> {
    return await LP_SUBSCRIPTION_ADDRESS.create(
      createSubscriptionAddressRequest,
      {
        transaction: t,
      },
    );
  }

  public async createSubscriptionOrder(
    createSubscriptionOrderRequest: CreateSubscriptionOrderRequest,
    t?: Transaction,
  ): Promise<LP_SUBSCRIPTION_ORDER> {
    return await LP_SUBSCRIPTION_ORDER.create(createSubscriptionOrderRequest, {
      transaction: t,
    });
  }

  public async getSubscriptionsByNextDate(): Promise<LP_SUBSCRIPTION[]> {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysBeforeNextDate);

    const endOfTargetDay = new Date(targetDate.setHours(23, 59, 59, 999));

    return await LP_SUBSCRIPTION.findAll({
      where: {
        nextDate: {
          [Op.lte]: endOfTargetDay,
        },
        subscriptionStatus: SubscriptionStatus.CONTINUE,
      },
      include: [
        {
          association: LP_SUBSCRIPTION.associations.lpSubscriptionAddress,
        },
        {
          association: LP_SUBSCRIPTION.associations.lpSubscriptionProducts,
          include: [
            {
              association: LP_SUBSCRIPTION_PRODUCT.associations.product,
            },
          ],
        },
      ],
    });
  }

  public getSubscriptionById = async (id: string, t?: Transaction) => {
    const result = await LP_SUBSCRIPTION.findOne({
      where: { id: id },
      transaction: t,
    });
    return result?.dataValues;
  };

  public async updateNextDate(
    id: string,
    newNextDate: Date,
    t?: Transaction,
  ): Promise<void> {
    await LP_SUBSCRIPTION.update(
      { nextDate: newNextDate },
      { where: { id: id }, transaction: t },
    );
  }
}
