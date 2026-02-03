/**
 * Metrics Controller
 * Handles Prometheus metrics endpoint
 */

import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { MetricsService } from '../services/metrics.service';

export class MetricsController extends BaseController {
  private metricsService: MetricsService;

  constructor() {
    super();
    this.metricsService = MetricsService.getInstance();
  }

  /**
   * Metrics endpoint
   * GET /metrics
   */
  public getMetrics = async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const metrics = await this.metricsService.getMetrics();
      res.set('Content-Type', this.metricsService.getContentType());
      return res.send(metrics);
    } catch (error) {
      return this.serverError(res, error as Error);
    }
  };
}
