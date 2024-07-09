import { ErrorType } from './ErrorType';
import { ErrorCode } from './ErrorCode';
import { StatusCode } from './StatusCode';

export abstract class ApiError extends Error {
  protected constructor(
    public type: ErrorType,
    public message: string = 'error',
    public errorCode: ErrorCode = ErrorCode.INTERNAL,
    public statusCode: StatusCode = StatusCode.SYSTEM_ERROR,
  ) {
    super(type);
  }
}

export class AuthFailureError extends ApiError {
  constructor(message = 'Invalid Credentials', errorCode = ErrorCode.UNAUTHORIZED) {
    super(ErrorType.UNAUTHORIZED, message, errorCode);
  }
}

export class InternalError extends ApiError {
  constructor(message = 'Internal error', errorCode = ErrorCode.INTERNAL) {
    super(ErrorType.INTERNAL, message, errorCode);
  }
}

export class BadRequestError extends ApiError {
  constructor(message = 'Bad Request', errorCode = ErrorCode.BAD_REQUEST) {
    super(
      ErrorType.BAD_REQUEST,
      message,
      errorCode,
      StatusCode.BUSINESS_FAIL,
    );
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Not Found', errorCode = ErrorCode.NOT_FOUND) {
    super(ErrorType.NOT_FOUND, message, errorCode);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Permission denied', errorCode = ErrorCode.FORBIDDEN) {
    super(ErrorType.FORBIDDEN, message, errorCode);
  }
}

export class NoEntryError extends ApiError {
  constructor(message = "Entry don't exists") {
    super(ErrorType.NO_ENTRY, message);
  }
}

export class BadTokenError extends ApiError {
  constructor(message = 'Token is not valid') {
    super(ErrorType.BAD_TOKEN, message);
  }
}

export class TokenExpiredError extends ApiError {
  constructor(message = 'Token is expired', errorCode = ErrorCode.TOKEN_EXPIRED) {
    super(ErrorType.TOKEN_EXPIRED, message, errorCode);
  }
}

export class NoDataError extends ApiError {
  constructor(message = 'No data available', errorCode = ErrorCode.NOT_FOUND) {
    super(ErrorType.NO_DATA, message, errorCode);
  }
}

export class AccessTokenError extends ApiError {
  constructor(message = 'Invalid access token') {
    super(ErrorType.ACCESS_TOKEN, message);
  }
}

export class DataExists extends ApiError {
  constructor(message = 'Data already exists', errorCode = ErrorCode.ALREADY_EXISTS) {
    super(ErrorType.DATA_EXISTS, message, errorCode);
  }
}

