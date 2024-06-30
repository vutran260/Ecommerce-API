import { IsNotEmpty, IsString } from 'class-validator';
import { LP_STORECreationAttributes } from '../../../lib/mysql/models/LP_STORE';

export default class StoreCreateRequest {
  @IsString()
  @IsNotEmpty()
  contractId: string;

  @IsString()
  @IsNotEmpty()
  storeKey: string;

  @IsString()
  @IsNotEmpty()
  storeName: string;

  @IsString()
  @IsNotEmpty()
  companyAddress: string;

  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsString()
  @IsNotEmpty()
  status: string;

}


export const StoreCreateRequestToLP_STORECreationAttributes = (request: StoreCreateRequest): LP_STORECreationAttributes => {
  return {
    contractId: request.contractId,
    storeKey: request.storeKey,
    storeName: request.storeName,
    status: request.status,
    companyAddress: request.companyAddress,
    companyName: request.companyName,
  }
}
