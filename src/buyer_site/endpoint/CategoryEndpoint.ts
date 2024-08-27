import express, { Response } from 'express';
import { ResponseData, ResponseListData } from '../../lib/http/Response';
import { PagingMiddelware } from '../../lib/paging/Middelware';
import { PaginationRequest } from '../../lib/paging/Request';
import { CategoryUsecase } from '../usecase/CategoryUsecase';
import { ProtectedRequest } from '../../lib/http/app-request';
import { StoreFilterMiddelware } from '../middleware/StoreFilterMiddelware';

export class CategoryEndpoint {
  private categoryUsecase: CategoryUsecase;

  constructor(categoryUsecase: CategoryUsecase) {
    this.categoryUsecase = categoryUsecase;
  }

  private detailCategory = async (req: ProtectedRequest, res: Response) => {
    const id: string = req.params.id;
    const results = await this.categoryUsecase.detailCategory(id, req.storeId!);
    return ResponseData(results, res);
  };

  private getCategories = async (req: PaginationRequest, res: Response) => {
    const results = await this.categoryUsecase.getCategories(
      req.filterList,
      req.paging,
    );
    return ResponseListData(results, res, req.paging);
  };

  public getRouter() {
    const router = express.Router();
    router.get('/detail/:id', this.detailCategory);
    router.get(
      '/categories',
      PagingMiddelware,
      StoreFilterMiddelware,
      this.getCategories,
    );

    return router;
  }
}
