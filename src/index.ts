/**
 * Application Entry Point
 * Clean, OOP-based architecture following SOLID principles
 */

import { App } from './app';

// Create and start application
const application = new App();
application.listen();

// Export for testing
export default application.getApp();
