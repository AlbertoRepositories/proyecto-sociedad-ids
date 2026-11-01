import type { User } from "../models/User";

/**
 * Extends Express Request with the authenticated domain user.
 *
 * SOLID:
 * - DIP: controllers depend on the authenticated user abstraction,
 *   not on a concrete authentication implementation.
 *
 * Refactoring:
 * - Introduce Type Extension: adds the custom request contract
 *   without modifying Express source files.
 */
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export {};