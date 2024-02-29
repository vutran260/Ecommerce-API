import CategoryCreateRequest from '../../admin_site/requests/categories/CategoryCreateRequest';
import { Filter, Paging } from '../../lib/paging/Request';
import { CategoryRepository } from '../repository/CategoryRepository';

export class CategoryUsecase {
  private categoryRepo: CategoryRepository;

  constructor(categoryRepo: CategoryRepository) {
    this.categoryRepo = categoryRepo;
  }

  public createCategory = async (
    categoryCreateRequest: CategoryCreateRequest,
  ) => {
    return this.categoryRepo.createCategory(categoryCreateRequest);
  };

  public updateCategory = async (
    categoryCreateRequest: CategoryCreateRequest,
    id: string,
  ) => {
    return this.categoryRepo.updateCategory(categoryCreateRequest, id);
  };

  public deleteCategory = async (id: string) => {
    return this.categoryRepo.deleteCategory(id);
  };

  public detailCategory = async (id: string) => {
    return this.categoryRepo.getCategoryId(id);
  };

  public getCategories = async (filter: Filter[], paging: Paging) => {
    return this.categoryRepo.getCategories(filter, paging);
  };
}
