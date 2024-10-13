import express from 'express';
import { GMOPaymentService } from '../third_party/gmo_getway/GMOPaymentSerivce';
import { AddressEndpoint } from './endpoint/AddressEndpoint';
import { BuyerEndpoint } from './endpoint/BuyerEndpoint';
import { BuyerPostEndpoint } from './endpoint/BuyerPostEndpoint';
import { CardEndpoint } from './endpoint/CardEndpoint';
import { CartEndpoint } from './endpoint/CartEndpoint';
import { OrderEndpoint } from './endpoint/OrderEndpoint';
import { PrefectureEndpoint } from './endpoint/PrefectureEndpoint';
import { ProductEndpoint } from './endpoint/ProductEndpoint';
import { StoreEndpoint } from './endpoint/StoreEndpoint';
import { SubscriptionEndpoint } from './endpoint/SubscriptionEndpoint';
import { BuyerAuthenMiddlleware } from './middleware/BuyerAuthenMiddleware';
import { AddressRepository } from './repository/AddressRepository';
import { BuyerPostRepository } from './repository/BuyerPostRepository';
import { BuyerRepository } from './repository/BuyerRepository';
import { CartRepository } from './repository/CartRepository';
import { CategoryRepository } from './repository/CategoryRepository';
import { OrderAddressBuyerRepository } from './repository/OrderAddressBuyerRepository';
import { OrderItemRepository } from './repository/OrderItemRepository';
import { OrderPaymentRepository } from './repository/OrderPaymentRepository';
import { OrderRepository } from './repository/OrderRepository';
import { PrefectureRepository } from './repository/PrefectureRepository';
import { ProductRepository } from './repository/ProductRepository';
import { ShipmentRepository } from './repository/ShipmentRepository';
import { StoreRepository } from './repository/StoreRepository';
import { AddressUsecase } from './usecase/AddressUsecase';
import { BuyerPostUsecase } from './usecase/BuyerPostUsecase';
import { S3Service } from '../third_party/s3/s3Service';
import { UploadEndpoint } from './endpoint/UploadEnpoint';
import { UploadUsecase } from './usecase/UploadUsecase';
import { BuyerUsecase } from './usecase/BuyerUsecase';
import { CardUsecase } from './usecase/CardUsecase';
import { CartUsecase } from './usecase/CartUsecase';
import { OrderUsecase } from './usecase/OrderUsecase';
import { PrefectureUsecase } from './usecase/PrefectureUsecase';
import { ProductUsecase } from './usecase/ProductUsecase';
import { StoreUsecase } from './usecase/StoreUsecase';
import { SubscriptionRepository } from './repository/SubscriptionRepository';
import { SubscriptionUseCase } from './usecase/SubscriptionUsecase';
import { MailService } from '../third_party/mail/mailService';
import { PdfService } from '../third_party/pdf/pdfService';
import { SSOUseCase } from './usecase/SSOUseCase';
import { SSOEndpoint } from './endpoint/SSOEndpoint';
import { ProductRecentlyViewedUseCase } from './usecase/ProductRecentlyViewedUsecase';
import { ProductRecentlyViewedRepository } from './repository/ProductRecentlyViewedRepository';
import { ProductRecentlyViewedEndpoint } from './endpoint/ProductRecentlyViewedEndpoint';
import { InvoiceRepository } from './repository/InvoiceRepository';
import { PaymentUseCase } from './usecase/PaymentUsecase';
import { MailUseCase } from './usecase/MailUsecase';
import { InvoiceUseCase } from './usecase/InvoiceUsecase';
import { PaymentEndpoint } from './endpoint/PaymentEndpoint';

export class buyerSiteRouter {
  public getBuyerSiteRouter = () => {
    const router = express.Router();

    const buyerRepo = new BuyerRepository();
    const categorytRepo = new CategoryRepository();
    const productRepo = new ProductRepository();
    const storeRepo = new StoreRepository();
    const addressRepo = new AddressRepository();
    const prefectureRepo = new PrefectureRepository();
    const orderRepo = new OrderRepository();
    const orderItemRepo = new OrderItemRepository();
    const cartRepo = new CartRepository();
    const orderPaymentRepo = new OrderPaymentRepository();
    const shipmentRepository = new ShipmentRepository();
    const orderAddressBuyerRepository = new OrderAddressBuyerRepository();
    const buyerPostRepo = new BuyerPostRepository();
    const subscriptionRepo = new SubscriptionRepository();
    const productRecentlyViewedRepo = new ProductRecentlyViewedRepository();
    const invoiceRepository = new InvoiceRepository();

    //3-party
    const gmoGetwaySerivce = new GMOPaymentService();
    const s3Service = new S3Service();
    const mailService = new MailService();
    const pdfService = new PdfService();

    const buyerUsecase = new BuyerUsecase(buyerRepo);
    const productUsecase = new ProductUsecase(productRepo, categorytRepo);
    const storeUsecase = new StoreUsecase(storeRepo);
    const addressUsecase = new AddressUsecase(addressRepo);
    const prefectureUsecase = new PrefectureUsecase(prefectureRepo);
    const cardUsecase = new CardUsecase(gmoGetwaySerivce);
    const paymentUseCase = new PaymentUseCase(gmoGetwaySerivce, cardUsecase);
    const mailUseCase = new MailUseCase(orderRepo, mailService);
    const invoiceUseCase = new InvoiceUseCase(
      orderRepo,
      invoiceRepository,
      mailService,
      pdfService,
    );
    const orderUsecase = new OrderUsecase(
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
    );
    const buyerPostUsecase = new BuyerPostUsecase(buyerPostRepo);
    const uploadUsecase = new UploadUsecase(s3Service);
    const subscriptionUseCase = new SubscriptionUseCase(
      subscriptionRepo,
      mailUseCase,
    );
    const ssoUseCase = new SSOUseCase();
    const productRecentlyViewedUseCase = new ProductRecentlyViewedUseCase(
      productRecentlyViewedRepo,
    );

    const buyerEndpoint = new BuyerEndpoint(buyerUsecase);
    const productEndpoint = new ProductEndpoint(productUsecase);
    const storeEndpoint = new StoreEndpoint(storeUsecase);
    const addressEndpoint = new AddressEndpoint(addressUsecase);
    const prefectureEndpoint = new PrefectureEndpoint(prefectureUsecase);
    const buyerPostEndpoint = new BuyerPostEndpoint(buyerPostUsecase);

    const cartUseCase = new CartUsecase(productRepo, cartRepo);
    const cartEndpoint = new CartEndpoint(cartUseCase);
    const cardEndpoint = new CardEndpoint(cardUsecase);
    const orderEndpoint = new OrderEndpoint(orderUsecase, invoiceUseCase);
    const uploadEndpoint = new UploadEndpoint(uploadUsecase);
    const subscriptionEndpoint = new SubscriptionEndpoint(subscriptionUseCase);
    const ssoEndpoint = new SSOEndpoint(ssoUseCase);
    const productRecentlyViewedEndpoint = new ProductRecentlyViewedEndpoint(
      productRecentlyViewedUseCase,
    );
    const paymentEndpoint = new PaymentEndpoint(paymentUseCase);

    router.use('/prefectures', prefectureEndpoint.getRouter());
    router.use('/buyer', buyerEndpoint.getRouter());
    router.use('/sso', ssoEndpoint.getRouter());
    router.use(BuyerAuthenMiddlleware);
    router.use('/cart', cartEndpoint.getRouter());
    router.use('/card', cardEndpoint.getRouter());
    router.use('/address', addressEndpoint.getRouter());
    router.use('/product', productEndpoint.getRouter());
    router.use('/store', storeEndpoint.getRouter());
    router.use('/order', orderEndpoint.getRouter());
    router.use('/post', buyerPostEndpoint.getRouter());
    router.use('/file', uploadEndpoint.getRouter());
    router.use('/subscription', subscriptionEndpoint.getRouter());
    router.use(
      '/product-recently-viewed',
      productRecentlyViewedEndpoint.getRouter(),
    );
    router.use('/payment', paymentEndpoint.getRouter());

    return router;
  };
}
