import { Request, Response, NextFunction } from 'express';
import { AppError, ApiResponse, ErrorResponse } from '../types/index.js';

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Error:', err);

  // Default error response
  let statusCode = 500;
  let response: ErrorResponse = {
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    },
  };

  // Handle AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    response.error = {
      code: err.code,
      message: err.message,
      details: err.details,
    };
  }
  // Handle validation errors
  else if (err instanceof SyntaxError && 'body' in err) {
    statusCode = 400;
    response.error = {
      code: 'VALIDATION_ERROR',
      message: 'Invalid request body',
    };
  }
  // Handle other errors
  else if (err instanceof Error) {
    response.error = {
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected error occurred',
    };
  }

  res.status(statusCode).json(response);
}

// 404 handler
export function notFoundHandler(req: Request, res: Response) {
  const response: ErrorResponse = {
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
    },
  };

  res.status(404).json(response);
}
