import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { OrderStatus } from '../../lib/constant/Constant';
import { UpdateOrderStatusRequest } from '../model/orders/Order';

@ValidatorConstraint({ async: false })
export class IsOrderStatusSequentialConstraint
  implements ValidatorConstraintInterface
{
  validate(newStatus: any, args: ValidationArguments) {
    const request = args.object as UpdateOrderStatusRequest;

    const allowedTransitions: Record<string, OrderStatus[]> = {
      [OrderStatus.WAITING_APPROVE]: [
        OrderStatus.APPROVED,
        OrderStatus.REJECTED,
      ],
      [OrderStatus.APPROVED]: [
        OrderStatus.WAITING_CONFIRMED,
        OrderStatus.CANCEL,
      ],
      [OrderStatus.REJECTED]: [OrderStatus.CANCEL],
      [OrderStatus.WAITING_CONFIRMED]: [
        OrderStatus.CONFIRMED_ORDER,
        OrderStatus.CANCEL,
      ],
      [OrderStatus.CONFIRMED_ORDER]: [
        OrderStatus.DELIVERING,
        OrderStatus.CANCEL,
      ],
      [OrderStatus.DELIVERING]: [OrderStatus.DELIVERED, OrderStatus.CANCEL],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CANCEL]: [],
    };

    return allowedTransitions[request.currentStatus || ''].includes(newStatus);
  }

  defaultMessage(args: ValidationArguments) {
    return `Order status cannot transition from '${(args.object as UpdateOrderStatusRequest).currentStatus}' to '${args.value}'.`;
  }
}

export function IsOrderStatusSequential(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsOrderStatusSequentialConstraint,
    });
  };
}
