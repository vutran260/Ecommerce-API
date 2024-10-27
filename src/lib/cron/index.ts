import { SubscriptionOrderCron } from './subscriptionOrderCron';
import { SubscriptionRepository } from '../../buyer_site/repository/SubscriptionRepository';
import { OrderUsecase } from '../../buyer_site/usecase/OrderUsecase';
import { ProductRepository } from '../../buyer_site/repository/ProductRepository';
import { AddressRepository } from '../../buyer_site/repository/AddressRepository';
import { OrderRepository } from '../../buyer_site/repository/OrderRepository';
import { OrderItemRepository } from '../../buyer_site/repository/OrderItemRepository';
import { CartRepository } from '../../buyer_site/repository/CartRepository';
import { OrderPaymentRepository } from '../../buyer_site/repository/OrderPaymentRepository';
import { ShipmentRepository } from '../../buyer_site/repository/ShipmentRepository';
import { OrderAddressBuyerRepository } from '../../buyer_site/repository/OrderAddressBuyerRepository';
import { GMOPaymentService } from '../../third_party/gmo_getway/GMOPaymentSerivce';
import { CardUsecase } from '../../buyer_site/usecase/CardUsecase';
import { MailService } from '../../third_party/mail/mailService';
import { PaymentUseCase } from '../../buyer_site/usecase/PaymentUsecase';
import { MailUseCase } from '../../buyer_site/usecase/MailUsecase';
import { ShipmentUseCase } from '../../buyer_site/usecase/ShipmentUseCase';

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
const cardUsecase = new CardUsecase(gmoGetwaySerivce);
const paymentUseCase = new PaymentUseCase(gmoGetwaySerivce, cardUsecase);
const shipmentUseCase = new ShipmentUseCase();
const mailUseCase = new MailUseCase(orderRepo, mailService, shipmentUseCase);

const subscriptionRepository = new SubscriptionRepository();
const orderUseCase = new OrderUsecase(
  orderRepo,
  orderItemRepo,
  cartRepo,
  orderPaymentRepo,
  shipmentRepository,
  orderAddressBuyerRepository,
  addressRepo,
  productRepo,
  subscriptionRepo,
  paymentUseCase,
  mailUseCase,
  shipmentUseCase,
);
const cardUseCase = new CardUsecase(gmoGetwaySerivce);

const subscriptionOrderCron = new SubscriptionOrderCron(
  subscriptionRepository,
  orderUseCase,
  cardUseCase,
  mailUseCase,
);

export function startAllCronJobs() {
  subscriptionOrderCron.start();
}
