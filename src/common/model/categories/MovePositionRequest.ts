import { IsNotEmpty, IsString } from "class-validator";
import { CategoryTypeAction } from "../../../lib/constant/Category";

export default class MovePositionRequest {
  parentId?: string;
  typeAction: CategoryTypeAction;
}