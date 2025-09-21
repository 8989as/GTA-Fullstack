import '@testing-library/jest-dom';

// Polyfill for TextEncoder/TextDecoder
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() { }
  disconnect() { }
  observe() { }
  unobserve() { }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() { }
  disconnect() { }
  observe() { }
  unobserve() { }
};

// Mock MutationObserver
global.MutationObserver = class MutationObserver {
  constructor() { }
  disconnect() { }
  observe() { }
  unobserve() { }
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock scrollTo and scroll methods
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: jest.fn(),
});

Object.defineProperty(window, 'scroll', {
  writable: true,
  value: jest.fn(),
});

// Mock window.location
delete window.location;
window.location = {
  href: 'http://localhost:3000',
  origin: 'http://localhost:3000',
  protocol: 'http:',
  host: 'localhost:3000',
  hostname: 'localhost',
  port: '3000',
  pathname: '/',
  search: '',
  hash: '',
  assign: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
};

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
  writable: true,
});

// Mock console methods to reduce noise in tests
const originalConsole = global.console;
global.console = {
  ...originalConsole,
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
};

// Set up default fetch mock
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    statusText: 'OK',
    headers: new Headers(),
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    blob: () => Promise.resolve(new Blob()),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
  })
);

// Mock URL.createObjectURL and revokeObjectURL
global.URL.createObjectURL = jest.fn(() => 'mocked-url');
global.URL.revokeObjectURL = jest.fn();

// Mock File and FileReader
global.File = class MockFile {
  constructor(parts, filename, properties) {
    this.parts = parts;
    this.name = filename;
    this.size = parts.reduce((acc, part) => acc + part.length, 0);
    this.type = properties?.type || '';
    this.lastModified = properties?.lastModified || Date.now();
  }
};

global.FileReader = class MockFileReader {
  constructor() {
    this.readyState = 0;
    this.result = null;
    this.error = null;
  }

  readAsDataURL() {
    this.readyState = 2;
    this.result = 'data:text/plain;base64,dGVzdA==';
    if (this.onload) this.onload();
  }

  readAsText() {
    this.readyState = 2;
    this.result = 'test';
    if (this.onload) this.onload();
  }
};

// Mock HTMLCanvasElement methods
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  fillRect: jest.fn(),
  clearRect: jest.fn(),
  getImageData: jest.fn(() => ({ data: new Array(4) })),
  putImageData: jest.fn(),
  createImageData: jest.fn(() => ({ data: new Array(4) })),
  setTransform: jest.fn(),
  drawImage: jest.fn(),
  save: jest.fn(),
  fillText: jest.fn(),
  restore: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  closePath: jest.fn(),
  stroke: jest.fn(),
  translate: jest.fn(),
  scale: jest.fn(),
  rotate: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  measureText: jest.fn(() => ({ width: 0 })),
  transform: jest.fn(),
  rect: jest.fn(),
  clip: jest.fn(),
}));

// Mock HTMLCanvasElement.toDataURL
HTMLCanvasElement.prototype.toDataURL = jest.fn(() => 'data:image/png;base64,test');

// Mock Image constructor
global.Image = class MockImage {
  constructor() {
    this.src = '';
    this.alt = '';
    this.onload = null;
    this.onerror = null;
  }
};

// Mock alert, confirm, and prompt
global.alert = jest.fn();
global.confirm = jest.fn(() => true);
global.prompt = jest.fn(() => 'test');

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
  // Reset localStorage and sessionStorage
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
  localStorageMock.clear.mockClear();
  sessionStorageMock.getItem.mockClear();
  sessionStorageMock.setItem.mockClear();
  sessionStorageMock.removeItem.mockClear();
  sessionStorageMock.clear.mockClear();
});

// Global test utilities
global.testUtils = {
  // Helper to create mock React components
  createMockComponent: (name) => {
    const MockComponent = (props) => {
      return React.createElement('div', { 'data-testid': name, ...props });
    };
    MockComponent.displayName = name;
    return MockComponent;
  },

  // Helper to create mock context providers
  createMockProvider: (name, value) => {
    const MockProvider = ({ children }) => {
      return React.createElement('div', { 'data-testid': `${name}-provider` }, children);
    };
    MockProvider.displayName = `${name}Provider`;
    return MockProvider;
  },

  // Helper to wait for async operations
  waitForAsync: () => new Promise(resolve => setTimeout(resolve, 0)),
};