/**
 * Middleware classes
 * Following Single Responsibility and Open/Closed principles
 */

import { Request, Response, NextFunction } from 'express';
import { MetricsService } from '../services/metrics.service';

/**
 * Base Middleware class (Template pattern)
 */
export abstract class BaseMiddleware {
  abstract handle(req: Request, res: Response, next: NextFunction): void;
}

/**
 * Metrics Middleware
 * Records HTTP request metrics
 */
export class MetricsMiddleware extends BaseMiddleware {
  private metricsService: MetricsService;

  constructor() {
    super();
    this.metricsService = MetricsService.getInstance();
  }

  public handle(req: Request, res: Response, next: NextFunction): void {
    res.on('finish', () => {
      this.metricsService.recordRequest(
        req.method,
        req.path,
        res.statusCode
      );
    });
    next();
  }
}

/**
 * Error Handler Middleware
 * Centralized error handling
 */
export class ErrorHandlerMiddleware {
  public handle(err: Error, req: Request, res: Response, next: NextFunction): void {
    console.error('Error:', err.stack);

    res.status(500).json({
      error: 'Something went wrong!',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}

/**
 * Request Logger Middleware
 * Logs incoming requests
 */
export class RequestLoggerMiddleware extends BaseMiddleware {
  public handle(req: Request, res: Response, next: NextFunction): void {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
  }
}
