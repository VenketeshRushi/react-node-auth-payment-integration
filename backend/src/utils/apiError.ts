export class APIError extends Error {
  public statusCode: number;
  public status: 'fail' | 'error';
  public isOperational: boolean;
  public errorCode?: string | undefined;
  public context?: Record<string, any> | undefined;

  constructor(
    message: string,
    statusCode = 500,
    errorCode?: string,
    context?: Record<string, any>
  ) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.errorCode = errorCode;
    this.context = context;

    Error.captureStackTrace?.(this, this.constructor);
  }
}
