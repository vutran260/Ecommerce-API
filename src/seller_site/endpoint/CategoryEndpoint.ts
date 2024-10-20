import express, { Response } from 'express';
import Logger from '../../lib/core/Logger';
import { validatorRequest } from '../../lib/helpers/validate';
import { ResponseData, ResponseListData } from '../../lib/http/Response';
import { PagingMiddelware } from '../../lib/paging/Middelware';
import { PaginationRequest } from '../../lib/paging/Request';
import { CategoryUsecase } from '../usecase/CategoryUsecase';
import CategoryCreateRequest from '../../common/model/categories/CategoryCreateRequest';
import { ProtectedRequest } from '../../lib/http/app-request';
import { StoreFilterMiddelware } from '../middleware/StoreFilterMiddelware';
import MovePositionRequest from '../../common/model/categories/MovePositionRequest';
import { plainToClass } from 'class-transformer';
import UpdateCategoryRequest from '../../common/model/categories/UpdateCategoryRequest';

export class CategoryEndpoint {
  private categoryUsecase: CategoryUsecase;

  constructor(categoryUsecase: CategoryUsecase) {
    this.categoryUsecase = categoryUsecase;
  }

  private createCategory = async (req: ProtectedRequest, res: Response) => {
    try {
      const categories = await this.categoryUsecase.getCategoriesTheSameLevel(
        req.body.parentId || null,
        req.storeId!,
      );
      const categoryCreateRequest = plainToClass(
        CategoryCreateRequest,
        req.body,
      );
      categoryCreateRequest.orderLevel = categories.length + 1;
      categoryCreateRequest.storeId = req.storeId;

      await validatorRequest(categoryCreateRequest);
      const results = await this.categoryUsecase.createCategory(
        categoryCreateRequest,
        req.storeId!,
      );
      return ResponseData(results, res);
    } catch (error: any) {
      Logger.error(error.message);
      throw error;
    }
  };

  private updateCategory = async (req: ProtectedRequest, res: Response) => {
    const id: string = req.params.id;
    const updateCreateRequest = plainToClass(UpdateCategoryRequest, req.body);
    await validatorRequest(updateCreateRequest);
    const results = await this.categoryUsecase.updateCategory(
      updateCreateRequest,
      id,
      req.storeId!,
    );
    return ResponseData(results, res);
  };

  private deleteCategory = async (req: ProtectedRequest, res: Response) => {
    const ids: string[] = req.body.ids;
    await this.categoryUsecase.deleteCategory(ids, req.storeId!);
    return ResponseData({ message: 'Deleted is successfully!' }, res);
  };

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

  private getCategoriesWithHierarchy = async (
    req: ProtectedRequest,
    res: Response,
  ) => {
    const id = req.query.id?.toString() || '';
    const response = await this.categoryUsecase.getCategoriesWithHierarchy(
      req.storeId!,
      id,
    );
    return ResponseData(response, res);
  };

  private moveUpCategory = async (req: ProtectedRequest, res: Response) => {
    const id: string = req.params.id;
    const { parentId, typeAction } = req.body;
    const moveUpCategoryRequest: MovePositionRequest = {
      parentId: parentId || null,
      typeAction: typeAction,
    };
    await validatorRequest(moveUpCategoryRequest);
    const results = await this.categoryUsecase.moveUpCategory(
      moveUpCategoryRequest,
      id,
      req.storeId!,
    );
    return ResponseData(results, res);
  };

  public getRouter() {
    const router = express.Router();
    router.post('/create', this.createCategory);
    router.put('/update/:id', this.updateCategory);
    router.post('/delete', this.deleteCategory);
    router.get('/detail/:id', this.detailCategory);
    router.get(
      '/categories',
      PagingMiddelware,
      StoreFilterMiddelware,
      this.getCategories,
    );

    router.get('/categories/hierarchy', this.getCategoriesWithHierarchy);
    router.put('/move/:id', this.moveUpCategory);
    return router;
  }
}
