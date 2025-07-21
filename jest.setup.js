import "@testing-library/jest-dom";

// Mock window.location
delete window.location;
window.location = {
  href: "",
  origin: "http://localhost:3000",
  pathname: "/",
  search: "",
  hash: "",
  host: "localhost:3000",
  hostname: "localhost",
  port: "3000",
  protocol: "http:",
  reload: jest.fn(),
  replace: jest.fn(),
  assign: jest.fn(),
};

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock URL constructor
global.URL = class URL {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(url, base) {
    this.href = url;
    this.searchParams = {
      set: jest.fn(),
      get: jest.fn(),
      has: jest.fn(),
      delete: jest.fn(),
      toString: jest.fn(() => ""),
    };
  }
  toString() {
    return this.href;
  }
};

// Mock Date.now
const mockDateNow = jest.fn(() => 1642780800000);
global.Date.now = mockDateNow;

// Mock IntersectionObserver (sometimes needed for UI components)
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};
