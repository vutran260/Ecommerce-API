import { LpOrder } from '../../lib/paging/Order';
import { Filter, Paging } from '../../lib/paging/Request';
import {
  CreateProductInput,
  ProductRepository,
} from '../repository/ProductRepository';
import {
  BadRequestError,
} from '../../lib/http/custom_error/ApiError';
import { booleanToTINYINT } from '../../lib/helpers/utils';
import { CategoryRepository } from '../repository/CategoryRepository';
import Product from '../../common/model/products/Product';
import ProductOption from '../../common/model/products/ProductOption';
import ProductOptionPrice from '../../common/model/products/ProductOptionPrice';
import moment from 'moment';
import { DATE_FORMAT } from '../../lib/constant/Constant';

export class ProductUsecase {
  private productRepo: ProductRepository;
  private categoryRepo: CategoryRepository;

  constructor(productRepo: ProductRepository,
    categoryRepo: CategoryRepository
  ) {
    this.productRepo = productRepo;
    this.categoryRepo = categoryRepo;
  }

  public createProduct = async (input: Product) => {

    this.validateProduct(input);

    const createProductRepoInput = this.mapToCreateProductRepoInput(input)

    return await this.productRepo.createProduct(createProductRepoInput);
  };

  public updateProduct = async (input: Product) => {

    this.validateProduct(input);

    return await this.productRepo.updateProduct(input);
  };


  private validateProduct(input: Product) {
    if (input.hasOption) {
      this.validateOption(input.options, input.optionPrices);
    } else {
      this.validatePrice(input);
    }

    this.validateDiscount(input)

    if (input.isSubscription) {
      if (input.buyingPeriod?.length === 0) {
        throw new BadRequestError('subscription product must have buying period');
      }
    }

    if (!input.hasOption && (input.optionPrices?.length > 0 || input.options?.length > 0)) {
      throw new BadRequestError('fix price product must not have option or option price');
    }
  }

  public deleteProduct = async (id: string) => {
    return this.productRepo.deleteProducts([id]);
  };


  public deleteProducts = async (ids: string[]) => {
    return this.productRepo.deleteProducts(ids);
  }

  public detailProduct = async (id: string) => {
    return this.productRepo.getProductId(id);
  };

  public activeProduct = async (id: string) => {
    return this.productRepo.activeProductId(id);
  }
  public inactiveProduct = async (id: string) => {
    return this.productRepo.inactiveProductId(id);
  }
  public getProducts = async (
    filter: Filter[],
    order: LpOrder[],
    paging: Paging,
    categoryId: string,
  ) => {
    let categoryIds = null
    if (!!categoryId) {
      categoryIds = await this.categoryRepo.getAllLeafInSub(categoryId);
    }


    return this.productRepo.getProducts(filter, order, paging, categoryIds);
  };



  private mapToCreateProductRepoInput = (
    input: Product
  ) => {
    const createProduct: CreateProductInput = {
      storeId: input.storeId,
      isSubscription: input.isSubscription ? 1 : 0,
      isDiscount: input.isDiscount ? 1 : 0,
      buyingPeriod: input.buyingPeriod?.join(','),
      isRecommend: input.isRecommend ? 1 : 0,
      productName: input.productName,
      productImage: input.productImage?.join(','),
      productDescription: input.productDescription,
      capacity: input.capacity,
      expirationUseDate: input.expirationUseDate,
      storageMethod: input.storageMethod,
      intakeMethod: input.intakeMethod,
      ingredient: input.ingredient,
      notificationNumber: input.notificationNumber,
      notification: input.notification,
      hasOption: input.hasOption ? 1 : 0,
      productTag: input.productTag,
      status: input.status,
      lpProductComponents: input.components.map((component) => {
        return {
          productId: '',
          amount: component.amount,
          unit: component.unit,
        };
      }),
      lpProductOptions: input.options.map((option) => {
        return {
          productId: '',
          optionType: option.optionType,
          optionValue: option.optionValue.join(','),
          optionOrder: option.order,
        };
      }),
      lpProductOptionPrices: input.optionPrices.map((optionPrice) => {
        return {
          productId: '',
          optionValue1: optionPrice.optionValue1,
          optionValue2: optionPrice.optionValue2,
          optionValue3: optionPrice.optionValue3,
          price: parseFloat(optionPrice.price),
          priceBeforeDiscount: parseFloat(optionPrice.priceBeforeDiscount),
          cost: parseFloat(optionPrice.cost),
          stockItem: optionPrice.stockItem,
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
      discountTimeFrom: input.discountTimeFrom ? moment(input.discountTimeFrom, DATE_FORMAT).toDate() : undefined,
      discountTimeTo: input.discountTimeTo ? moment(input.discountTimeTo, DATE_FORMAT).toDate() : undefined,
    };

    return createProduct;
  }

  private validateOption = (
    options: ProductOption[],
    optionPrices: ProductOptionPrice[],
  ) => {
    if (options == null || optionPrices == null || options.length === 0 || optionPrices.length === 0) {
      throw new BadRequestError('invalid option price setting');
    }

    const lengthOptionPrices = options.reduce(
      (length, option) => length * option.optionValue.length,
      1,
    );

    if (optionPrices.length !== lengthOptionPrices) {
      throw new BadRequestError('invalid option price setting');
    }

    const optionOrder = options.sort((a, b) => {
      return a.order - b.order;
    });

    optionPrices.forEach((optionPrice) => {
      if (
        optionPrice.optionValue1 === null ||
        !optionOrder[0].optionValue.includes(optionPrice.optionValue1)
      ) {
        throw new BadRequestError('invalid option price setting');
      }
      if (
        optionPrice.optionValue2 !== null &&
        optionOrder.length > 1 &&
        !optionOrder[1].optionValue.includes(optionPrice.optionValue2)
      ) {
        throw new BadRequestError('invalid option price setting');
      }
      if (
        optionPrice.optionValue3 !== null &&
        optionOrder.length > 2 &&
        !optionOrder[2].optionValue.includes(optionPrice.optionValue3)
      ) {
        throw new BadRequestError('invalid option price setting');
      }
    });


  };

  private validatePrice = (input: Product) => {
    if (!input.price || !input.stockItem) {
      throw new BadRequestError('invalid price setting');
    }

    if (input.isSubscription && !input.priceSubscription) {
      throw new BadRequestError('priceSubscription is required')
    }
  }

  private validateDiscount = (input: Product) => {
    if (!input.isDiscount) {
      return
    }

    if (!input.discountPercentage) {
      throw new BadRequestError('discountPercentage is required when product is discounted')
    }

    if (input.hasDiscountSchedule === undefined) {
      throw new BadRequestError('hasDiscountSchedule is required when product is discounted')
    }

    if (!input.hasDiscountSchedule) {
      return
    }

    if (!input.discountTimeFrom || !input.discountTimeTo) {
      throw new BadRequestError('discountTimeFrom and discountTimeTo are required when product is discounted')
    }

    if (input.discountTimeFrom > input.discountTimeTo) {
      throw new BadRequestError('discountTimeFrom must be before discountTimeTo')
    }


  }
}
