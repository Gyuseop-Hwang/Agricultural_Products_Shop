export class AppError extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

export class BadRequestError extends AppError {
  constructor(message) {
    super(400, message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message) {
    super(401, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message) {
    super(403, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message) {
    super(404, message);
  }
}
