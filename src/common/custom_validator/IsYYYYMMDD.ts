import { ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from 'class-validator';

function isYYYYMMDD(value: string) {
    if (value == null || value === undefined) {
        return true;
    }
  // Regular expression to match YYYY/MM/DD format with mandatory parts
  const regex = /^\d{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])$/;
  return regex.test(value);
}

@ValidatorConstraint({ name: 'isYYYYMMDD' })
export class IsYYYYMMDDConstraint implements ValidatorConstraintInterface {
  validate(value: string) {
    return isYYYYMMDD(value);
  }
}

export function IsYYYYMMDD() {
  // Register the custom validation function as a decorator
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      validator: IsYYYYMMDDConstraint,
    });
  };
}