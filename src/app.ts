/**
 * Main Application Class
 * Following Single Responsibility and Dependency Inversion principles
 */

import express, { Application } from 'express';
import { ConfigService } from './config/app.config';
import { MetricsMiddleware, ErrorHandlerMiddleware, RequestLoggerMiddleware } from './middleware';
import { AppRouter } from './routes';

export class App {
  private app: Application;
  private config: ConfigService;
  private metricsMiddleware: MetricsMiddleware;
  private errorHandler: ErrorHandlerMiddleware;
  private requestLogger: RequestLoggerMiddleware;
  private router: AppRouter;

  constructor() {
    this.app = express();
    this.config = ConfigService.getInstance();
    this.metricsMiddleware = new MetricsMiddleware();
    this.errorHandler = new ErrorHandlerMiddleware();
    this.requestLogger = new RequestLoggerMiddleware();
    this.router = new AppRouter();

    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  /**
   * Initialize middleware
   */
  private initializeMiddleware(): void {
    // Body parser
    this.app.use(express.json());

    // Request logging (development only)
    if (this.config.isDevelopment()) {
      this.app.use((req, res, next) => this.requestLogger.handle(req, res, next));
    }

    // Metrics collection
    this.app.use((req, res, next) => this.metricsMiddleware.handle(req, res, next));
  }

  /**
   * Initialize routes
   */
  private initializeRoutes(): void {
    this.app.use(this.router.getRouter());
  }

  /**
   * Initialize error handling
   */
  private initializeErrorHandling(): void {
    this.app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) =>
      this.errorHandler.handle(err, req, res, next)
    );
  }

  /**
   * Start the server
   */
  public listen(): void {
    const port = this.config.get('port');

    if (!this.config.isTest()) {
      this.app.listen(port, () => {
        console.log(`🚀 Server running on port ${port}`);
        console.log(`📊 Health: http://localhost:${port}/health`);
        console.log(`📈 Metrics: http://localhost:${port}/metrics`);
        console.log(`🔧 Environment: ${this.config.get('nodeEnv')}`);
        console.log(`📦 Version: ${this.config.get('appVersion')}`);
      });
    }
  }

  /**
   * Get Express application instance
   */
  public getApp(): Application {
    return this.app;
  }
}
