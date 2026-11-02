import type { User } from "../models/User";

/**
 * Extends Express Request with the authenticated domain user.
 *
 * - DIP: controllers depend on the authenticated user abstraction,
 *   not on a concrete authentication implementation.
 */
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export {};