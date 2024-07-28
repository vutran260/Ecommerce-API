import { Filter, Paging } from "../../lib/paging/Request";
import { BadRequestError } from "../../lib/http/custom_error/ApiError";
import { StorePostRepository } from "../repository/StorePostRepository";
import { LpOrder } from "../../lib/paging/Order";
import { LP_STORE_POSTAttributes } from "../../lib/mysql/models/LP_STORE_POST";

export class StorePostUsecase {
  private storePostRepo: StorePostRepository


  constructor(storePostRepo: StorePostRepository) {
    this.storePostRepo = storePostRepo
  }

  public CreatePost = async (Post: LP_STORE_POSTAttributes) => {
    await this.storePostRepo.createPost(Post)
  }

  public getPosts = async (
    filter: Filter[],
    order: LpOrder[],
    paging: Paging,
  ) => {
    return await this.storePostRepo.getPosts( paging, order, filter)
  }

  public updatePost = async (updatePostInput: LP_STORE_POSTAttributes) => {

    const post = await this.storePostRepo.getPostById(updatePostInput.id);
    if (!post) {
      throw new BadRequestError('post not exist');
    }

    await this.storePostRepo.updatePost(updatePostInput);
    return this.storePostRepo.getPostById(updatePostInput.id);
  }

  public deletePost = async (id: string) => {
    const post = await this.storePostRepo.getPostById(id);
    if (!post) {
      throw new BadRequestError('post not exist');
    }
    await this.storePostRepo.deletePost(id)
  }
  public getPost = async (id: string,) => {
    const post = await this.storePostRepo.getPostById(id)
    return post
  }

  public activePost = async (id: string) => {
    const post = await this.storePostRepo.getPostById(id);
    if (!post) {
      throw new BadRequestError('post not exist');
    }
    return this.storePostRepo.activePostId(id);
  };
  public inactivePost = async (id: string) => {
    const post = await this.storePostRepo.getPostById(id);
    if (!post) {
      throw new BadRequestError('post not exist');
    }
    return this.storePostRepo.inactivePostId(id);
  };


}
