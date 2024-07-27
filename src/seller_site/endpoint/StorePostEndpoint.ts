import { ProtectedRequest } from "../../lib/http/app-request";
import { StorePostUsecase } from "../usecase/StorePostUsecase";
import { validatorRequest } from "../../lib/helpers/validate";
import { plainToInstance } from "class-transformer";
import { ResponseData, ResponseListData } from "../../lib/http/Response";
import express, { Response } from 'express';
import { IsNotEmpty, IsString } from "class-validator";
import { PaginationRequest } from "../../lib/paging/Request";
import { StoreFilterMiddelware } from "../../seller_site/middleware/StoreFilterMiddelware";
import { PagingMiddelware } from "../../lib/paging/Middelware";


export class StorePostEndpoint {
  private storePostUsecase: StorePostUsecase;

  constructor(storePostUsecase: StorePostUsecase) {
    this.storePostUsecase = storePostUsecase;
  }

  private createPost = async (req: ProtectedRequest, res: Response) => {
    const addPostRequest = plainToInstance(StorePost, req.body);
    addPostRequest.storeId = req.storeId;

    await validatorRequest(addPostRequest);
    await this.storePostUsecase.CreatePost(addPostRequest);
    return ResponseData("add post success!!!", res);
  };
  private getPosts = async (req: PaginationRequest, res: Response) => {
    const posts = await this.storePostUsecase.getPosts(req.filterList, req.order, req.paging)
    return ResponseListData(posts, res, req.paging)
  }

  private updatePost = async (req: ProtectedRequest, res: Response) => {
    const updatePostsRequest = plainToInstance(StorePost, req.body);
    updatePostsRequest.storeId = req.storeId
    // updateItemRequest.storeId = req.storeId;

    await validatorRequest(updatePostsRequest);
    await this.storePostUsecase.updatePost(updatePostsRequest);
    return ResponseData("update post success!!!", res);
  }

  private deletePost = async (req: ProtectedRequest, res: Response) => {
    const postId: string = req.params.id;
    await this.storePostUsecase.deletePost(postId);
    return ResponseData({ message: 'Deleted is successfully!' }, res);

  }


  private getPost = async (req: ProtectedRequest, res: Response) => {
    const id: string = req.params.id;

    const results = await this.storePostUsecase.getPost(id);
    return ResponseData(results, res)
  }

  private activePost = async (req: ProtectedRequest, res: Response) => {
    const id: string = req.params.id;
    await this.storePostUsecase.activePost(id);
    return ResponseData({ message: 'Active is successfully!' }, res);
  }
  private inactivePost = async (req: ProtectedRequest, res: Response) => {
    const id: string = req.params.id;
    await this.storePostUsecase.inactivePost(id);
    return ResponseData({ message: 'Inactive is successfully!' }, res);
  }

  public getRouter() {
    const router = express.Router();

    router.get('/', PagingMiddelware, StoreFilterMiddelware, this.getPosts);
    router.post('/', this.createPost);
    router.get('/:id', this.getPost);
    router.delete('/:id', this.deletePost);
    router.put('/', this.updatePost);
    router.put('/active/:id', this.activePost);
    router.put('/inactive/:id', this.inactivePost);
    return router;
  }
}


export class StorePost {
  id: string

  @IsString()
  @IsNotEmpty()
  storeId: string;


  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  postImage: string;

  @IsString()
  @IsNotEmpty()
  details: string;

  @IsString()
  @IsNotEmpty()
  status: string;
}