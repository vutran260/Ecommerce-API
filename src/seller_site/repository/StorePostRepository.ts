import {
  LP_STORE_POST,
  LP_STORE_POSTAttributes,
} from '../../lib/mysql/models/LP_STORE_POST';
import {
  BuildQuery,
  Filter,
  GetOffset,
  Paging,
} from '../../lib/paging/Request';
import { BuildOrderQuery, LpOrder } from '../../lib/paging/Order';
import { Op } from 'sequelize';
import { NotFoundError } from '../../lib/http/custom_error/ApiError';

export class StorePostRepository {
  public createPost = async (postData: LP_STORE_POSTAttributes) => {
    await LP_STORE_POST.create(postData);
    return;
  };

  public getPostById = async (id: string) => {
    const post = await LP_STORE_POST.findByPk(id);
    if (!post) {
      throw new NotFoundError();
    }
    return post;
  };

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

    return posts;
  };

  public updatePost = async (updateData: LP_STORE_POSTAttributes) => {
    const result = await LP_STORE_POST.update(updateData, {
      where: { id: updateData.id },
    });
    return result;
  };

  public deletePost = async (id: string) => {
    const result = await LP_STORE_POST.destroy({
      where: { id: id },
    });
  };

  public deletePosts = async (ids: string[], storeId: string) => {
    await LP_STORE_POST.destroy({
      where: {
        id: { [Op.in]: ids },
        storeId: storeId,
      },
    });
  };

  public activePostId = async (id: string) => {
    await LP_STORE_POST.update({ status: 'ACTIVE' }, { where: { id: id } });
  };

  public inactivePostId = async (id: string) => {
    await LP_STORE_POST.update({ status: 'INACTIVE' }, { where: { id: id } });
  };
}
