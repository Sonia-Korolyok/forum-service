// Jest setup file
import mongoose from 'mongoose';
import {jest, afterAll, afterEach, beforeEach} from "@jest/globals";

const consoleError = console.error;
beforeEach(() => {
  console.error = jest.fn();
});
afterEach(() => {
  console.error = consoleError;
  jest.clearAllMocks();
});

// Increase timeout for all tests
jest.setTimeout(10000);

// Clean up after all tests
afterAll(async () => {
  // Close mongoose connection if it's open
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
});