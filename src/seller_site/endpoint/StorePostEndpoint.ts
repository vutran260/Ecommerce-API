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
import { LP_STORE_POSTAttributes } from "../../lib/mysql/models/LP_STORE_POST";


export class StorePostEndpoint {
  private storePostUsecase: StorePostUsecase;

  constructor(storePostUsecase: StorePostUsecase) {
    this.storePostUsecase = storePostUsecase;
  }

  private createPost = async (req: ProtectedRequest, res: Response) => {
    const addPostRequest = plainToInstance(StorePost, req.body);
    addPostRequest.storeId = req.storeId;

    await validatorRequest(addPostRequest);

    const addPostInput = addPostRequest.toLpPost();
    addPostInput.createdBy = req.user.id;
    addPostInput.updatedBy = req.user.id;

    await this.storePostUsecase.CreatePost(addPostInput);
    return ResponseData("add post success!!!", res);
  };
  private getPosts = async (req: PaginationRequest, res: Response) => {
    const posts = await this.storePostUsecase.getPosts(req.filterList, req.order, req.paging)
    return ResponseListData(posts, res, req.paging)
  }

  private updatePost = async (req: ProtectedRequest, res: Response) => {
    const updatePostsRequest = plainToInstance(StorePost, req.body);
    updatePostsRequest.storeId = req.storeId

    await validatorRequest(updatePostsRequest);

    const updatePostInput = updatePostsRequest.toLpPost();
    updatePostInput.updatedBy = req.user.id;

    await this.storePostUsecase.updatePost(updatePostInput);
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

  private deletePosts = async (req: ProtectedRequest, res: Response) => {
    const ids: string[] = req.body.ids;
    await this.storePostUsecase.deletePosts(ids, req.storeId);
    return ResponseData({ message: 'Deleted is successfully!' }, res);
  }

  public getRouter() {
    const router = express.Router();

    router.get('/', PagingMiddelware, StoreFilterMiddelware, this.getPosts);
    router.post('/', this.createPost);
    router.get('/:id', this.getPost);
    router.delete('/delete/:id', this.deletePost);
    router.delete('/posts', this.deletePosts);
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

  toLpPost = ():LP_STORE_POSTAttributes =>{ 
    return {
      id: this.id,
      storeId: this.storeId,
      title: this.title,
      postImage: this.postImage,
      details: this.details,
      status: this.status
    }
  }
}

