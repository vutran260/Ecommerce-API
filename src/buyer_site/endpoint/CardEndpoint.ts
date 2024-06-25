import { CardUsecase } from '../usecase/CardUsecase';
import express, { Request, Response } from 'express';
import { ResponseData } from '../../lib/http/Response';
import { BuyerAuthenMiddlleware } from '../middleware/BuyerAuthenMiddleware';

export class CardEndpoint{
  private cardUsecase : CardUsecase


  constructor(cardUsecase: CardUsecase) {
    this.cardUsecase = cardUsecase;
  }

  private getCardByUserId = async(req: Request, res: Response)=>{
    const id: string = req.params.id;
    const results = await this.cardUsecase.getCards(id);
    return ResponseData(results, res);

  }

  private addCard= async (req: Request, res: Response)=>{
    const results = await this.cardUsecase.saveCards(req.body.userId, req.body.token);
    return ResponseData(results, res);
  }

  public getRouter() {
    const router = express.Router();
    router.use(BuyerAuthenMiddlleware);
    router.post('/', this.addCard);
    router.get('/:id', this.getCardByUserId)
    return router;
  }

}