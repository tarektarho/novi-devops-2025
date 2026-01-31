/**
 * Metrics Service
 * Handles Prometheus metrics collection following Single Responsibility Principle
 */

import * as promClient from 'prom-client';

export class MetricsService {
  private static instance: MetricsService;
  private httpRequestsTotal: promClient.Counter<'method' | 'endpoint' | 'status'>;
  private processUptimeSeconds: promClient.Gauge;

  private constructor() {
    // Collect default metrics
    promClient.collectDefaultMetrics();

    // Initialize HTTP requests counter
    this.httpRequestsTotal = new promClient.Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'endpoint', 'status']
    });

    // Initialize process uptime gauge
    this.processUptimeSeconds = new promClient.Gauge({
      name: 'process_uptime_seconds',
      help: 'Process uptime in seconds',
      collect() {
        this.set(process.uptime());
      }
    });
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): MetricsService {
    if (!MetricsService.instance) {
      MetricsService.instance = new MetricsService();
    }
    return MetricsService.instance;
  }

  /**
   * Record HTTP request
   */
  public recordRequest(method: string, endpoint: string, status: number): void {
    this.httpRequestsTotal.inc({
      method,
      endpoint,
      status: status.toString()
    });
    this.processUptimeSeconds.set(process.uptime());
  }

  /**
   * Get metrics in Prometheus format
   */
  public async getMetrics(): Promise<string> {
    return promClient.register.metrics();
  }

  /**
   * Get content type for metrics
   */
  public getContentType(): string {
    return promClient.register.contentType;
  }
}
