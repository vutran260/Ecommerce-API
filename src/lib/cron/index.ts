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
import { PdfService } from '../../third_party/pdf/pdfService';
import { InvoiceRepository } from '../../buyer_site/repository/InvoiceRepository';

const productRepo = new ProductRepository();
const addressRepo = new AddressRepository();
const orderRepo = new OrderRepository();
const orderItemRepo = new OrderItemRepository();
const cartRepo = new CartRepository();
const orderPaymentRepo = new OrderPaymentRepository();
const shipmentRepository = new ShipmentRepository();
const orderAddressBuyerRepository = new OrderAddressBuyerRepository();
const subscriptionRepo = new SubscriptionRepository();
const invoiceRepository = new InvoiceRepository();
const gmoGetwaySerivce = new GMOPaymentService();
const mailService = new MailService();
const pdfService = new PdfService();

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
  invoiceRepository,
  mailService,
  pdfService,
);
const cardUseCase = new CardUsecase(gmoGetwaySerivce);

const subscriptionOrderCron = new SubscriptionOrderCron(
  subscriptionRepository,
  orderRepo,
  orderUseCase,
  cardUseCase,
  mailService,
);

export function startAllCronJobs() {
  subscriptionOrderCron.start();
}
