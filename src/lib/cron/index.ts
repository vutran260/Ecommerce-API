import { SubscriptionOrderCron } from './subscriptionOrderCron';
import { SubscriptionRepository } from 'src/buyer_site/repository/SubscriptionRepository';
import { OrderUsecase } from 'src/buyer_site/usecase/OrderUsecase';
import { ProductRepository } from 'src/buyer_site/repository/ProductRepository';
import { AddressRepository } from 'src/buyer_site/repository/AddressRepository';
import { OrderRepository } from 'src/buyer_site/repository/OrderRepository';
import { OrderItemRepository } from 'src/buyer_site/repository/OrderItemRepository';
import { CartRepository } from 'src/buyer_site/repository/CartRepository';
import { OrderPaymentRepository } from 'src/buyer_site/repository/OrderPaymentRepository';
import { ShipmentRepository } from 'src/buyer_site/repository/ShipmentRepository';
import { OrderAddressBuyerRepository } from 'src/buyer_site/repository/OrderAddressBuyerRepository';
import { GMOPaymentService } from 'src/third_party/gmo_getway/GMOPaymentSerivce';
import { CardUsecase } from 'src/buyer_site/usecase/CardUsecase';
import { MailService } from 'src/third_party/mail/mailService';

const productRepo = new ProductRepository();
const addressRepo = new AddressRepository();
const orderRepo = new OrderRepository();
const orderItemRepo = new OrderItemRepository();
const cartRepo = new CartRepository();
const orderPaymentRepo = new OrderPaymentRepository();
const shipmentRepository = new ShipmentRepository();
const orderAddressBuyerRepository = new OrderAddressBuyerRepository();
const subscriptionRepo = new SubscriptionRepository();
const gmoGetwaySerivce = new GMOPaymentService();
const mailService = new MailService();

const subscriptionRepository = new SubscriptionRepository();
const orderUseCase = new OrderUsecase(
  orderRepo,
  orderItemRepo,
  cartRepo,
  orderPaymentRepo,
  shipmentRepository,
  orderAddressBuyerRepository,
  addressRepo,
  gmoGetwaySerivce,
  productRepo,
  subscriptionRepo,
  mailService,
);
const cardUseCase = new CardUsecase(gmoGetwaySerivce);

const subscriptionOrderCron = new SubscriptionOrderCron(
  subscriptionRepository,
  orderUseCase,
  cardUseCase,
);

export function startAllCronJobs() {
  subscriptionOrderCron.start();
}
