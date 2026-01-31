/**
 * Health Controller
 * Handles health check and info endpoints
 */

import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { ConfigService } from '../config/app.config';

export class HealthController extends BaseController {
  private config: ConfigService;
  private requestCount: number = 0;

  constructor() {
    super();
    this.config = ConfigService.getInstance();
  }

  /**
   * Health check endpoint
   * GET /health
   */
  public health = (req: Request, res: Response): Response => {
    return this.ok(res, {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: this.config.get('appVersion'),
      requestNumber: this.requestCount
    });
  };

  /**
   * Application info endpoint
   * GET /api/info
   */
  public info = (req: Request, res: Response): Response => {
    this.requestCount++;

    return this.ok(res, {
      app: 'Items Management Service',
      version: this.config.get('appVersion'),
      node_version: process.version,
      platform: process.platform,
      uptime: process.uptime(),
      environment: this.config.get('nodeEnv')
    });
  };

  /**
   * Root endpoint
   * GET /
   */
  public root = (req: Request, res: Response): Response => {
    return this.ok(res, {
      message: 'Welcome to Items Management Service!',
      version: this.config.get('appVersion'),
      environment: this.config.get('nodeEnv')
    });
  };
}
