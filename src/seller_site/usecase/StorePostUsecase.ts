import { Filter, Paging } from "../../lib/paging/Request";
import { BadRequestError } from "../../lib/http/custom_error/ApiError";
import { StorePost } from "../endpoint/StorePostEndpoint";
import { StorePostRepository } from "../repository/StorePostRepository";
import { LpOrder } from "../../lib/paging/Order";

export class StorePostUsecase {
  private storePostRepo: StorePostRepository


  constructor(storePostRepo: StorePostRepository) {
    this.storePostRepo = storePostRepo
  }

  public CreatePost = async (Post: StorePost) => {
    if (!Post.postImage) {
      throw new BadRequestError('Missing image')
    }
    if (!Post.title) {
      throw new BadRequestError('Missing title')
    }
    if (!Post.details) {
      throw new BadRequestError('Missing details')
    }
    await this.storePostRepo.createPost(Post)

  }

  public getPosts = async (
    filter: Filter[],
    order: LpOrder[],
    paging: Paging,
  ) => {
    return await this.storePostRepo.getPosts( paging, order, filter)
  }

  public updatePost = async (updatePostRequest: StorePost) => {

    const post = await this.storePostRepo.getPostById(updatePostRequest.id);
    if (!post) {
      throw new BadRequestError('post not exist');
    }
    await this.storePostRepo.updatePost(updatePostRequest.id, updatePostRequest);
    return this.storePostRepo.getPostById(updatePostRequest.id);
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
