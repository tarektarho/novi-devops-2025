/**
 * Base Controller
 * Abstract class providing common controller functionality
 */

import { Request, Response } from 'express';

export abstract class BaseController {
  /**
   * Send success response
   */
  protected ok<T>(res: Response, data: T, statusCode: number = 200): Response {
    return res.status(statusCode).json(data);
  }

  /**
   * Send created response
   */
  protected created<T>(res: Response, data: T): Response {
    return res.status(201).json(data);
  }

  /**
   * Send error response
   */
  protected fail(res: Response, message: string, statusCode: number = 400): Response {
    return res.status(statusCode).json({ error: message });
  }

  /**
   * Send not found response
   */
  protected notFound(res: Response, message: string = 'Resource not found'): Response {
    return res.status(404).json({ error: message });
  }

  /**
   * Send server error response
   */
  protected serverError(res: Response, error: Error | string): Response {
    const message = error instanceof Error ? error.message : error;
    return res.status(500).json({ error: 'Internal server error', message });
  }
}
