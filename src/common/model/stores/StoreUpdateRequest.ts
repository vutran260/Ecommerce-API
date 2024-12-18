import { IsNotEmpty, IsNumber } from 'class-validator';

export default class StoreUpdateRequest {
  @IsNumber({ maxDecimalPlaces: 1 })
  @IsNotEmpty()
  pointRate: number;
}
