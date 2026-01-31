/**
 * Router configuration
 * Centralized route definitions following Open/Closed principle
 */

import { Router } from 'express';
import { HealthController } from '../controllers/health.controller';
import { MetricsController } from '../controllers/metrics.controller';
import { ItemsController } from '../controllers/items.controller';

export class AppRouter {
  private router: Router;
  private healthController: HealthController;
  private metricsController: MetricsController;
  private itemsController: ItemsController;

  constructor() {
    this.router = Router();
    this.healthController = new HealthController();
    this.metricsController = new MetricsController();
    this.itemsController = new ItemsController();

    this.initializeRoutes();
  }

  /**
   * Initialize all routes
   */
  private initializeRoutes(): void {
    this.setupHealthRoutes();
    this.setupMetricsRoutes();
    this.setupItemsRoutes();
  }

  /**
   * Setup health and info routes
   */
  private setupHealthRoutes(): void {
    this.router.get('/', this.healthController.root);
    this.router.get('/health', this.healthController.health);
    this.router.get('/api/info', this.healthController.info);
  }

  /**
   * Setup metrics routes
   */
  private setupMetricsRoutes(): void {
    this.router.get('/metrics', this.metricsController.getMetrics);
  }

  /**
   * Setup items CRUD routes
   */
  private setupItemsRoutes(): void {
    this.router.get('/api/items', this.itemsController.getAll);
    this.router.get('/api/items/:id', this.itemsController.getById);
    this.router.post('/api/items', this.itemsController.create);
    this.router.put('/api/items/:id', this.itemsController.update);
    this.router.delete('/api/items/:id', this.itemsController.delete);
  }

  /**
   * Get configured router
   */
  public getRouter(): Router {
    return this.router;
  }
}
