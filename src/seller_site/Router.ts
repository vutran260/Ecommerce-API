import express from 'express';
import { CategoryEndpoint } from './endpoint/CategoryEndpoint';
import { OrderEndpoint } from './endpoint/OrderEndpoint';
import { ProductEndpoint } from './endpoint/ProductEndpoint';
import { SellerEndpoint } from './endpoint/SellerEndpoint';
import { StoreEndpoint } from './endpoint/StoreEndpoint';
import { StorePostEndpoint } from './endpoint/StorePostEndpoint';
import { SellerAuthenMiddlleware } from './middleware/SellerAuthenMiddleware';
import { StoreAuthenMiddlleware } from './middleware/StoreAuthenMiddllware';
import { CategoryRepository } from './repository/CategoryRepository';
import { OrderItemRepository } from './repository/OrderItemRepository';
import { OrderRepository } from './repository/OrderRepository';
import { ProductRepository } from './repository/ProductRepository';
import { SellerRepository } from './repository/SellerRepository';
import { StorePostRepository } from './repository/StorePostRepository';
import { StoreRepository } from './repository/StoreRepository';
import { CategoryUsecase } from './usecase/CategoryUsecase';
import { OrderUsecase } from './usecase/OrderUsecase';
import { ProductUsecase } from './usecase/ProductUsecase';
import { SellerUsecase } from './usecase/SellerUsecase';
import { StorePostUsecase } from './usecase/StorePostUsecase';
import { StoreUsecase } from './usecase/StoreUsecase';
import { UploadEndpoint } from './endpoint/UploadEnpoint';
import { UploadUsecase } from './usecase/UploadUsecase';
import { S3Service } from '../third_party/s3/s3Service';
import { BuyerEndpoint } from './endpoint/BuyerEndpoint';
import { BuyerRepository } from './repository/BuyerRepository';
import { BuyerUsecase } from './usecase/BuyerUsecase';
import { SubscriptionEndpoint } from './endpoint/SubscriptionEndpoint';
import { SubscriptionUseCase } from './usecase/SubscriptionUsecase';
import { SubscriptionRepository } from './repository/SubscriptionRepository';
import { SubscriptionOrderRepository } from './repository/SubscriptionOrderRepository';
import { SSOUseCase } from './usecase/SSOUseCase';
import { SSOEndpoint } from './endpoint/SSOEndpoint';

export class sellerSiteRouter {
  public getSellerSiteRouter = () => {
    const router = express.Router();

    const sellerRepo = new SellerRepository();
    const storeRepo = new StoreRepository();
    const productRepo = new ProductRepository();
    const categorytRepo = new CategoryRepository();
    const storePostRepo = new StorePostRepository();
    const orderRepo = new OrderRepository();
    const orderItemRepo = new OrderItemRepository();
    const buyerRepo = new BuyerRepository();
    const subscriptionRepo = new SubscriptionRepository();
    const subscriptionOrderRepository = new SubscriptionOrderRepository();

    // third party
    const s3Service = new S3Service();

    const sellerUsecase = new SellerUsecase(sellerRepo);
    const storeUsecase = new StoreUsecase(storeRepo, sellerRepo);
    const categoryUsecase = new CategoryUsecase(categorytRepo);
    const productUsecase = new ProductUsecase(productRepo, categorytRepo);
    const storePostUsecase = new StorePostUsecase(storePostRepo);
    const orderUsecase = new OrderUsecase(orderRepo, orderItemRepo);
    const buyerUsecase = new BuyerUsecase(buyerRepo);
    const uploadUsecase = new UploadUsecase(s3Service);
    const subscriptionUseCase = new SubscriptionUseCase(
      subscriptionRepo,
      subscriptionOrderRepository,
    );
    const ssoUseCase = new SSOUseCase();

    const productEndpoint = new ProductEndpoint(productUsecase);
    const categoryEndpoint = new CategoryEndpoint(categoryUsecase);
    const storeEndpoint = new StoreEndpoint(storeUsecase);
    const sellerEndpoint = new SellerEndpoint(sellerUsecase);
    const storePostEndpoint = new StorePostEndpoint(storePostUsecase);
    const orderEndpoint = new OrderEndpoint(orderUsecase);
    const uploadEndpoint = new UploadEndpoint(uploadUsecase);
    const buyerEndpoint = new BuyerEndpoint(buyerUsecase);
    const subscriptionEndpoint = new SubscriptionEndpoint(subscriptionUseCase);
    const ssoEndpoint = new SSOEndpoint(ssoUseCase);

    router.use('/seller', sellerEndpoint.getRouter());
    router.use('/sso', ssoEndpoint.getRouter());
    router.use(SellerAuthenMiddlleware);
    router.use('/store', storeEndpoint.getRouter());
    router.use('/post', storePostEndpoint.getRouter());

    router.use(StoreAuthenMiddlleware);
    router.use('/product', productEndpoint.getRouter());
    router.use('/category', categoryEndpoint.getRouter());
    router.use('/order', orderEndpoint.getRouter());
    router.use('/file', uploadEndpoint.getRouter());
    router.use('/buyer', buyerEndpoint.getRouter());
    router.use('/subscription', subscriptionEndpoint.getRouter());
    return router;
  };
}

// module.exports = { timestamps: false }
// "gen-model": "sequelize-auto -o ./src/lib/mysql/models -l ts -a ./config.js -d link-palette-dev -h localhost -u link-palette -p 1111 -x P@ssw0rd -e mysql"
