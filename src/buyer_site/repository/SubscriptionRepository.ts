import { Op, Transaction } from 'sequelize';
import {
  CreateSubscriptionAddressRequest,
  CreateSubscriptionOrderRequest,
  CreateSubscriptionProductRequest,
  CreateSubscriptionRequest,
} from '../../common/model/orders/Subscription';
import {
  LP_STORE,
  LP_SUBSCRIPTION,
  LP_SUBSCRIPTION_ADDRESS,
  LP_SUBSCRIPTION_ORDER,
  LP_SUBSCRIPTION_PRODUCT,
  LP_SUBSCRIPTIONAttributes,
} from '../../lib/mysql/models/init-models';
import { SubscriptionStatus } from '../../lib/constant/Constant';
import { daysBeforeNextDate } from '../../Config';
import {
  BuildQuery,
  Filter,
  GetOffset,
  Paging,
} from '../../lib/paging/Request';
import { BuildOrderQuery, LpOrder } from '../../lib/paging/Order';

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
        subscriptionStatus: {
          [Op.in]: [SubscriptionStatus.NEW, SubscriptionStatus.CONTINUE],
        },
      },
      include: [
        {
          association: LP_SUBSCRIPTION.associations.lpSubscriptionAddress,
        },
        {
          association: LP_SUBSCRIPTION.associations.store,
          include: [
            {
              association: LP_STORE.associations.lpSellers,
            },
          ],
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

  public getSubscriptions = async (
    paging: Paging,
    order: LpOrder[],
    filter: Filter[],
  ) => {
    const count = await LP_SUBSCRIPTION.count({
      where: BuildQuery(filter),
    });

    const subscriptions = await LP_SUBSCRIPTION.findAll({
      where: BuildQuery(filter),
      include: [
        {
          association: LP_SUBSCRIPTION.associations.lpSubscriptionProducts,
          include: [
            {
              association: LP_SUBSCRIPTION_PRODUCT.associations.product,
            },
          ],
        },
      ],
      offset: GetOffset(paging),
      order: BuildOrderQuery(order),
      limit: paging.limit,
    });

    paging.total = count;

    return subscriptions;
  };

  public getSubscriptionById = async (id: string, t?: Transaction) => {
    return await LP_SUBSCRIPTION.findOne({
      where: { id: id },
      include: [
        {
          association: LP_SUBSCRIPTION.associations.lpSubscriptionAddress,
        },
        {
          association: LP_SUBSCRIPTION.associations.lpSubscriptionOrders,
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
      transaction: t,
    });
  };

  public updateSubscription = async (
    request: Partial<LP_SUBSCRIPTIONAttributes>,
    t?: Transaction,
  ) => {
    await LP_SUBSCRIPTION.update(request, {
      where: {
        id: request.id,
      },
      ...(t && { transaction: t }),
    });
  };

  public updateSubscriptionStatus = async (params: {
    id: string;
    status: SubscriptionStatus;
    t?: Transaction;
  }) => {
    const { id, status, t } = params;
    await LP_SUBSCRIPTION.update(
      {
        subscriptionStatus: status,
      },
      {
        where: {
          id: id,
        },
        transaction: t,
      },
    );
  };
}
