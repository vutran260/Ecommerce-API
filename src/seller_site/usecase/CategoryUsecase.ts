import CategoryCreateRequest from '../../common/model/categories/CategoryCreateRequest';
import { Filter, Paging } from '../../lib/paging/Request';
import { CategoryRepository } from '../repository/CategoryRepository';
import MovePositionRequest from '../../common/model/categories/MovePositionRequest';
import UpdateCategoryRequest from '../../common/model/categories/UpdateCategoryRequest';

export class CategoryUsecase {
  private categoryRepo: CategoryRepository;

  constructor(categoryRepo: CategoryRepository) {
    this.categoryRepo = categoryRepo;
  }

  public createCategory = async (
    categoryCreateRequest: CategoryCreateRequest,
    storeId: string,
  ) => {
    return this.categoryRepo.createCategory(categoryCreateRequest, storeId);
  };

  public updateCategory = async (
    updateCategoryRequest: UpdateCategoryRequest,
    id: string,
    storeId: string,
  ) => {
    return this.categoryRepo.updateCategory(updateCategoryRequest, id, storeId);
  };

  public deleteCategory = async (ids: string[], storeId: string) => {
    return this.categoryRepo.deleteCategory(ids, storeId);
  };

  public detailCategory = async (id: string, storeId: string) => {
    return this.categoryRepo.getCategoryId(id, storeId);
  };

  public getCategories = async (filter: Filter[], paging: Paging) => {
    return this.categoryRepo.getCategories(filter, paging);
  };

  public getCategoriesWithHierarchy = async (store_id: string, id = '') => {
    return this.categoryRepo.getCategoriesWithHierarchy(store_id, id);
  };

  public getCategoriesTheSameLevel = async (
    parentId?: string,
    storeId?: string,
  ) => {
    return this.categoryRepo.getCategoriesTheSameLevel(parentId, storeId);
  };

  public moveUpCategory = async (
    input: MovePositionRequest,
    id: string,
    storeId: string,
  ) => {
    return this.categoryRepo.moveUpCategory(input, id, storeId);
  };
}
