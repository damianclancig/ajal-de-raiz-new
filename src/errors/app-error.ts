export abstract class AppError extends Error {
  public abstract readonly code: string;
  public readonly isOperational: boolean;
  public readonly metadata: Record<string, any>;

  constructor(message: string, isOperational = true, metadata: Record<string, any> = {}) {
    super(message);
    this.name = this.constructor.name;
    this.isOperational = isOperational;
    this.metadata = metadata;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class GeneralAppError extends AppError {
  public readonly code: string;

  constructor(code: string, message: string, isOperational = true, metadata: Record<string, any> = {}) {
    super(message, isOperational, metadata);
    this.code = code;
  }
}
