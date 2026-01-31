// Jest setup: polyfills for Node.js 25 and jsdom
const { TextEncoder, TextDecoder } = require('util');

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}

// Add setImmediate for prom-client compatibility
if (typeof global.setImmediate === 'undefined') {
  global.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args);
}

if (typeof global.clearImmediate === 'undefined') {
  global.clearImmediate = clearTimeout;
}

// Prevent localStorage initialization issues
try {
  const originalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  if (!originalStorage || !originalStorage.get) {
    Object.defineProperty(globalThis, 'localStorage', {
      get() {
        return undefined;
      },
      configurable: true,
      enumerable: false
    });
  }
} catch {}
