import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

function isHHMM(value: string) {
  if (value == null) {
    return true;
  }
  // Regular expression to match YYYY/MM/DD format with mandatory parts
  const regex = /^(?:[01]\d|2[0-3]):[0-5]?\d$/;
  return regex.test(value);
}

@ValidatorConstraint({ name: 'isHHMM' })
export class IsHHMMConstraint implements ValidatorConstraintInterface {
  validate(value: string) {
    return isHHMM(value);
  }
}

export function IsHHMM() {
  // Register the custom validation function as a decorator
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      validator: IsHHMMConstraint,
    });
  };
}
