// Common utility functions used across examples

export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const generateId = (): number => Date.now();

export const randomFromArray = <T>(array: T[]): T =>
  array[Math.floor(Math.random() * array.length)];
