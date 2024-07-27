import { ProtectedRequest } from "../../lib/http/app-request";
import { BuyerPostUsecase } from "../usecase/BuyerPostUsecase";
import { validatorRequest } from "../../lib/helpers/validate";
import { plainToInstance } from "class-transformer";
import { ResponseData, ResponseListData } from "../../lib/http/Response";
import express, { Response } from 'express';
import { IsNotEmpty, IsString } from "class-validator";
import { PaginationRequest } from "../../lib/paging/Request";
import { StoreFilterMiddelware } from "../../buyer_site/middleware/StoreFilterMiddelware";
import { PagingMiddelware } from "../../lib/paging/Middelware";


export class BuyerPostEndpoint {
    private buyerPostUsecase: BuyerPostUsecase;

    constructor(buyerPostUsecase: BuyerPostUsecase) {
        this.buyerPostUsecase = buyerPostUsecase;
    }

    private getPosts = async (req: PaginationRequest, res: Response) => {
        const posts = await this.buyerPostUsecase.getPosts(req.filterList, req.order, req.paging)
        return ResponseListData(posts, res, req.paging)
    }

    private getPost = async (req: ProtectedRequest, res: Response) => {
        const id: string = req.params.id;

        const results = await this.buyerPostUsecase.getPost(id);
        return ResponseData(results, res)
    }

    public getRouter() {
        const router = express.Router();

        router.get('/', PagingMiddelware, StoreFilterMiddelware, this.getPosts);
        router.get('/:id', this.getPost);
        return router;
    }
}