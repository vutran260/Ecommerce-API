import express, { Request, Response } from 'express';
import Logger from '../../lib/core/Logger';
import { validatorRequest } from '../../lib/helpers/validate';
import { ResponseData, ResponseListData } from '../../lib/http/Response';
import { pagingMiddelware } from '../../lib/paging/Middelware';
import { PaginationRequest } from '../../lib/paging/Request';
import { CategoryUsecase } from '../usecase/CategoryUsecase';
import CategoryCreateRequest from '../../admin_site/requests/categories/CategoryCreateRequest';

export class CategoryEndpoint {
  private categoryUsecase: CategoryUsecase;

  constructor(categoryUsecase: CategoryUsecase) {
    this.categoryUsecase = categoryUsecase;
  }

  private createCategory = async (req: Request, res: Response) => {
    try {
      const categoryCreateRequest = new CategoryCreateRequest();
      categoryCreateRequest.parent_id = req.body.parent_id;
      categoryCreateRequest.category_name = req.body.category_name;
      categoryCreateRequest.category_tag = req.body.category_tag;
      categoryCreateRequest.status = req.body.status;
      await validatorRequest(categoryCreateRequest);
      const results = await this.categoryUsecase.createCategory(req.body);
      return ResponseData(results, res);
    } catch (error: any) {
      Logger.error(error.message);
      throw error;
    }
  };

  private updateCategory = async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const categoryCreateRequest = new CategoryCreateRequest();
    categoryCreateRequest.parent_id = req.body.parent_id;
    categoryCreateRequest.category_name = req.body.category_name;
    categoryCreateRequest.category_tag = req.body.category_tag;
    categoryCreateRequest.status = req.body.status;
    await validatorRequest(categoryCreateRequest);
    const results = await this.categoryUsecase.updateCategory(req.body, id);
    return ResponseData(results, res);
  };

  private deleteCategory = async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const results = await this.categoryUsecase.deleteCategory(id);
    return ResponseData({ message: 'Deleted is successfully!' }, res);
  };

  private detailCategory = async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const results = await this.categoryUsecase.detailCategory(id);
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
    router.post('/create', this.createCategory);
    router.put('/update/:id', this.updateCategory);
    router.delete('/delete/:id', this.deleteCategory);
    router.get('/detail/:id', this.detailCategory);
    router.get('/categories', pagingMiddelware, this.getCategories);
    return router;
  }
}
