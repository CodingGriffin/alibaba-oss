// Jest setup file
require('@testing-library/jest-dom');

// Mock fetch globally
global.fetch = jest.fn();

// Mock window.confirm
global.confirm = jest.fn(() => true);

