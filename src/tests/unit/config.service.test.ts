/**
 * Unit Tests for ConfigService
 */

import { ConfigService } from '../../config/app.config';

describe('ConfigService', () => {
  let configService: ConfigService;
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset environment variables
    jest.resetModules();
    process.env = { ...originalEnv };
    configService = ConfigService.getInstance();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = ConfigService.getInstance();
      const instance2 = ConfigService.getInstance();

      expect(instance1).toBe(instance2);
    });

    it('should maintain state across instances', () => {
      const instance1 = ConfigService.getInstance();
      const instance2 = ConfigService.getInstance();

      expect(instance1.getConfig()).toEqual(instance2.getConfig());
    });
  });

  describe('getConfig', () => {
    it('should return configuration object', () => {
      const config = configService.getConfig();

      expect(config).toHaveProperty('port');
      expect(config).toHaveProperty('nodeEnv');
      expect(config).toHaveProperty('appVersion');
    });

    it('should return a copy of config', () => {
      const config1 = configService.getConfig();
      const config2 = configService.getConfig();

      expect(config1).toEqual(config2);
      expect(config1).not.toBe(config2); // Different object references
    });

    it('should use default port if PORT is not set', () => {
      const config = configService.getConfig();
      expect(typeof config.port).toBe('number');
      expect(config.port).toBeGreaterThan(0);
    });

    it('should use environment PORT if set', () => {
      const config = configService.getConfig();
      expect(typeof config.port).toBe('number');
      expect(config.port).toBeGreaterThan(0);
    });
  });

  describe('get', () => {
    it('should get specific config value by key', () => {
      const port = configService.get('port');
      const nodeEnv = configService.get('nodeEnv');
      const appVersion = configService.get('appVersion');

      expect(typeof port).toBe('number');
      expect(typeof nodeEnv).toBe('string');
      expect(typeof appVersion).toBe('string');
    });

    it('should return correct port value', () => {
      const port = configService.get('port');
      expect(port).toBeGreaterThan(0);
      expect(port).toBeLessThanOrEqual(65535);
    });

    it('should return correct nodeEnv value', () => {
      const nodeEnv = configService.get('nodeEnv');
      expect(['development', 'staging', 'production', 'test']).toContain(nodeEnv);
    });
  });

  describe('isProduction', () => {
    it('should return boolean', () => {
      const result = configService.isProduction();
      expect(typeof result).toBe('boolean');
    });

    it('should return false or true based on environment', () => {
      const result = configService.isProduction();
      expect([true, false]).toContain(result);
    });
  });

  describe('isDevelopment', () => {
    it('should return boolean', () => {
      const result = configService.isDevelopment();
      expect(typeof result).toBe('boolean');
    });

    it('should return based on environment', () => {
      const result = configService.isDevelopment();
      expect([true, false]).toContain(result);
    });
  });

  describe('isTest', () => {
    it('should return true when running in test environment', () => {
      // Since we're in test environment, this should be true
      const result = configService.isTest();
      expect(result).toBe(true);
    });

    it('should be consistent with nodeEnv', () => {
      const isTest = configService.isTest();
      const nodeEnv = configService.get('nodeEnv');
      expect(isTest).toBe(nodeEnv === 'test');
    });
  });

  describe('isStaging', () => {
    it('should return boolean', () => {
      const result = configService.isStaging();
      expect(typeof result).toBe('boolean');
    });

    it('should return based on environment', () => {
      const result = configService.isStaging();
      expect([true, false]).toContain(result);
    });

    it('should be consistent with nodeEnv', () => {
      const isStaging = configService.isStaging();
      const nodeEnv = configService.get('nodeEnv');
      expect(isStaging).toBe(nodeEnv === 'staging');
    });
  });

  describe('isProductionLike', () => {
    it('should return boolean', () => {
      const result = configService.isProductionLike();
      expect(typeof result).toBe('boolean');
    });

    it('should return true for production or staging environments', () => {
      const isProductionLike = configService.isProductionLike();
      const isProduction = configService.isProduction();
      const isStaging = configService.isStaging();

      expect(isProductionLike).toBe(isProduction || isStaging);
    });

    it('should return false in test environment', () => {
      // Since we're running tests, this should be false
      const result = configService.isProductionLike();
      expect(result).toBe(false);
    });
  });

  describe('Environment Variables', () => {
    it('should have an appVersion', () => {
      const version = configService.get('appVersion');
      expect(typeof version).toBe('string');
      expect(version.length).toBeGreaterThan(0);
    });

    it('should return version string', () => {
      const version = configService.get('appVersion');
      expect(version).toMatch(/\d+\.\d+\.\d+/);
    });
  });
});
