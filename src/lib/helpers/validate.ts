import { validate } from 'class-validator';
import Logger from '../core/Logger';
import { BadRequestError } from '../http/custom_error/ApiError';

export const validatorRequest = async (request: any) => {
  const errors = await validate(request);
  if (errors.length > 0) {
    // If validation fails, send the validation errors
    Logger.error(errors);
    return errors.map((value, index) => {
      if (index === 0) {
        throw new BadRequestError(`${value.property} validate`);
      }
    });
  }
};
