import { LpOrder } from '../../lib/paging/Order';
import { Filter, Paging } from '../../lib/paging/Request';
import {
  CreateProductInput,
  ProductRepository,
} from '../repository/ProductRepository';
import { BadRequestError } from '../../lib/http/custom_error/ApiError';
import { booleanToTINYINT } from '../../lib/helpers/utils';
import { CategoryRepository } from '../repository/CategoryRepository';
import Product from '../../common/model/products/Product';
import moment from 'moment';
import { DATE_FORMAT } from '../../lib/constant/Constant';
import { lpSequelize } from '../../lib/mysql/Connection';
import Logger from '../../lib/core/Logger';

export class ProductUsecase {
  private productRepo: ProductRepository;
  private categoryRepo: CategoryRepository;

  constructor(
    productRepo: ProductRepository,
    categoryRepo: CategoryRepository,
  ) {
    this.productRepo = productRepo;
    this.categoryRepo = categoryRepo;
  }

  public createProduct = async (input: Product) => {
    this.validateProduct(input);

    const createProductRepoInput = this.mapToCreateProductRepoInput(input);

    const t = await lpSequelize.transaction();
    try {
      const out = await this.productRepo.createProduct(
        createProductRepoInput,
        t,
      );
      await t.commit();
      return out;
    } catch (error) {
      await t.rollback();
      Logger.error('Fail to create product');
      Logger.error(error);
      throw error;
    }
  };

  public updateProduct = async (input: Product) => {
    this.validateProduct(input);

    const t = await lpSequelize.transaction();
    try {
      const out = await this.productRepo.updateProduct(input, t);
      await t.commit();
      return out;
    } catch (error) {
      await t.rollback();
      Logger.error('Fail to create product');
      Logger.error(error);
      throw error;
    }
  };

  private validateProduct(input: Product) {
    if (input) {
      this.validatePrice(input);
    }

    this.validateDiscount(input);

    if (input.isSubscription) {
      if (input.buyingPeriod?.length === 0) {
        throw new BadRequestError(
          'subscription product must have buying period',
        );
      }
    }

    // if (this.hasDuplicateProductComponentName(input)) {
    //   throw new BadRequestError('product component name must be unique');
    // }
  }

  private hasDuplicateProductComponentName(input: Product): boolean {
    const lifOfComponents = input.components
      .filter((component) => component.componentName !== undefined)
      .map((component) => component.componentName.toLocaleLowerCase());
    return new Set(lifOfComponents).size !== lifOfComponents.length;
  }

  public deleteProduct = async (id: string) => {
    this.productRepo.deleteProducts([id]);
  };

  public deleteProducts = async (ids: string[]) => {
    await this.productRepo.deleteProducts(ids);
  };

  public detailProduct = async (id: string) => {
    return this.productRepo.getProductId(id);
  };

  public activeProduct = async (id: string) => {
    return this.productRepo.activeProductId(id);
  };
  public inactiveProduct = async (id: string) => {
    return this.productRepo.inactiveProductId(id);
  };
  public getProducts = async (
    filter: Filter[],
    order: LpOrder[],
    paging: Paging,
    categoryId: string,
    storeId: string,
  ) => {
    let categoryIds = null;
    if (categoryId) {
      categoryIds = await this.categoryRepo.getAllLeafInSub(categoryId);
    }

    return await this.productRepo.getProducts(
      filter,
      order,
      paging,
      categoryIds,
      storeId,
    );
  };

  private mapToCreateProductRepoInput = (input: Product) => {
    const createProduct: CreateProductInput = {
      storeId: input.storeId,
      isSubscription: input.isSubscription ? 1 : 0,
      isSpecial: input.isSpecial ? 1 : 0,
      isDiscount: input.isDiscount ? 1 : 0,
      buyingPeriod: input.buyingPeriod?.join(','),
      isRecommend: input.isRecommend ? 1 : 0,
      productName: input.productName,
      productImage: input.productImage?.join(','),
      productDescription: input.productDescription,
      productOverview: input.productOverview,
      productTag: input.productTag,
      status: input.status,
      lpProductComponents: input.components.map((component) => {
        return {
          productId: '',
          componentValue: component.componentValue,
          componentName: component.componentName,
        };
      }),
      lpProductFaqs: input.faqs.map((faq) => {
        return {
          productId: '',
          question: faq.question,
          answer: faq.answer,
        };
      }),
      lpProductCategories: input.categories.map((category) => {
        return {
          productId: '',
          categoryId: category,
        };
      }),
      price: input.price,
      priceSubscription: input.priceSubscription,
      cost: parseFloat(input.cost),
      stockItem: input.stockItem,
      discountPercentage: input.discountPercentage,
      hasDiscountSchedule: booleanToTINYINT(input.hasDiscountSchedule),
      // discountTimeFrom: input.discountTimeFrom ? moment(input.discountTimeFrom, DATE_FORMAT).toDate() : undefined,
      discountTimeFrom: !input.discountTimeFrom
        ? undefined
        : moment(input.discountTimeFrom, DATE_FORMAT).toDate(),
      discountTimeTo: !input.discountTimeTo
        ? undefined
        : moment(input.discountTimeTo, DATE_FORMAT).toDate(),
    };

    return createProduct;
  };

  private validatePrice = (input: Product) => {
    if (!input.price || !input.stockItem) {
      throw new BadRequestError('invalid price setting');
    }

    if (input.isSubscription && !input.priceSubscription) {
      throw new BadRequestError('priceSubscription is required');
    }
  };

  private validateDiscount = (input: Product) => {
    if (!input.isDiscount) {
      return;
    }

    if (!input.discountPercentage) {
      throw new BadRequestError(
        'discountPercentage is required when product is discounted',
      );
    }

    if (input.hasDiscountSchedule === undefined) {
      throw new BadRequestError(
        'hasDiscountSchedule is required when product is discounted',
      );
    }

    if (!input.hasDiscountSchedule) {
      return;
    }

    if (!input.discountTimeFrom || !input.discountTimeTo) {
      throw new BadRequestError(
        'discountTimeFrom and discountTimeTo are required when product is discounted',
      );
    }

    if (input.discountTimeFrom > input.discountTimeTo) {
      throw new BadRequestError(
        'discountTimeFrom must be before discountTimeTo',
      );
    }
  };
}
