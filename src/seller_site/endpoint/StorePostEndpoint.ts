import { ProtectedRequest } from "../../lib/http/app-request";
import { StorePostUsecase } from "../usecase/StorePostUsecase";
import { validatorRequest } from "../../lib/helpers/validate";
import { plainToInstance } from "class-transformer";
import { ResponseData } from "../../lib/http/Response";
import express, { Request, Response } from 'express';
import { IsNotEmpty, IsString } from "class-validator";


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