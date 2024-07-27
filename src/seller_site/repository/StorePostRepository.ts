import { StorePost } from '../endpoint/StorePostEndpoint';
import { LP_STORE_POST } from '../../lib/mysql/models/LP_STORE_POST';
import { BuildQuery, Filter, GetOffset, Paging } from '../../lib/paging/Request';
import { BuildOrderQuery, LpOrder } from '../../lib/paging/Order';


export class StorePostRepository {

  public createPost = async (postData: StorePost) => {
    const post = await LP_STORE_POST.create(postData)
    return
  }

  public getPostById = async (id: string) => {

    const post = await LP_STORE_POST.findByPk(id);
    return post
  }

  public getPosts = async (
    paging: Paging,
    order: LpOrder[],
    filter: Filter[],
  ) => {


    const count = await LP_STORE_POST.count({
      where: BuildQuery(filter),
    });

    const posts = await LP_STORE_POST.findAll({
      where: BuildQuery(filter),
      offset: GetOffset(paging),
      order: BuildOrderQuery(order),
      limit: paging.limit,
    });

    paging.total = count;

    return posts
  };

  public updatePost = async (id: string, updateData: any) => {

    const result = await LP_STORE_POST.update(updateData, {
      where: { id: id }
    });
    return result
  };
  public deletePost = async (id: string) => {
    const result = await LP_STORE_POST.destroy({
      where: { id: id }
    });
  }
  public activePostId = async (id: string) => {
    await LP_STORE_POST.update(
      { status: 'ACTIVE' },
      { where: { id: id } },
    );
  };

  public inactivePostId = async (id: string) => {
    await LP_STORE_POST.update(
      { status: 'INACTIVE' },
      { where: { id: id } },
    );
  };
}

