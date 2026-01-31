/**
 * Application configuration
 * Centralized configuration management following Single Responsibility Principle
 */

export type Environment = 'development' | 'staging' | 'production' | 'test';

export interface AppConfig {
  port: number;
  nodeEnv: Environment;
  appVersion: string;
}

export class ConfigService {
  private static instance: ConfigService;
  private config: AppConfig;

  private constructor() {
    this.config = {
      port: parseInt(process.env.PORT || '3000', 10),
      nodeEnv: (process.env.NODE_ENV as Environment) || 'development',
      appVersion: process.env.APP_VERSION || '1.0.0'
    };
  }

  /**
   * Get singleton instance (Singleton pattern)
   */
  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  /**
   * Get configuration
   */
  public getConfig(): AppConfig {
    return { ...this.config };
  }

  /**
   * Get specific config value
   */
  public get<K extends keyof AppConfig>(key: K): AppConfig[K] {
    return this.config[key];
  }

  /**
   * Check if running in production
   */
  public isProduction(): boolean {
    return this.config.nodeEnv === 'production';
  }

  /**
   * Check if running in staging
   */
  public isStaging(): boolean {
    return this.config.nodeEnv === 'staging';
  }

  /**
   * Check if running in test mode
   */
  public isTest(): boolean {
    return this.config.nodeEnv === 'test';
  }

  /**
   * Check if running in development
   */
  public isDevelopment(): boolean {
    return this.config.nodeEnv === 'development';
  }

  /**
   * Check if running in production-like environment (production or staging)
   */
  public isProductionLike(): boolean {
    return this.isProduction() || this.isStaging();
  }
}
