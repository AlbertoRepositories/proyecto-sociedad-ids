import jwt, {
  JwtPayload,
  SignOptions,
} from "jsonwebtoken";
import configService from "./config.service";
import { Logger } from "../logger/logger";
import { UserType } from "../types/enums";

export interface CustomJwtPayload extends JwtPayload {
  id: string | number;
  email: string;
  name: string;
  role: UserType;
}

interface TokenRequest {
  headers?: {
    authorization?: string;
  };
  query?: {
    token?: string;
  };
  cookies?: {
    token?: string;
  };
}

export const generateJWT = (
  payload: object,
  expiresIn: SignOptions["expiresIn"] = "24h"
): string => {
  try {
    const options: SignOptions = {
      expiresIn,
      issuer: "racoode-api",
      algorithm: "HS256",
    };

    return jwt.sign(payload, configService.SECRET, options);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : String(error);

    Logger.error(`Error generating JWT token: ${message}`);

    throw new Error("Error generating authentication token");
  }
};

export const verifyToken = (
  token: string | null
): CustomJwtPayload | null => {
  try {
    if (!token) {
      throw new Error("Token not provided");
    }

    const tokenParts = token.split(" ");
    const tokenValue =
      tokenParts.length === 2 ? tokenParts[1] : token;

    const decoded = jwt.verify(
      tokenValue,
      configService.SECRET
    ) as CustomJwtPayload;

    if (
      decoded.id === undefined ||
      !decoded.email ||
      !decoded.name ||
      !Object.values(UserType).includes(decoded.role)
    ) {
      throw new Error("Token payload is incomplete");
    }

    return decoded;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : String(error);

    Logger.error(`Error verifying JWT token: ${message}`);

    return null;
  }
};

export const extractToken = (
  request: TokenRequest
): string | null => {
  const authorizationHeader =
    request.headers?.authorization;

  if (authorizationHeader?.startsWith("Bearer ")) {
    return authorizationHeader.substring("Bearer ".length);
  }

  if (request.query?.token) {
    return request.query.token;
  }

  if (request.cookies?.token) {
    return request.cookies.token;
  }

  return null;
};