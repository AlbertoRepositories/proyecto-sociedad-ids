import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import configService from "./config.service.js";

interface CustomJwtPayload extends JwtPayload {
    id: string | number;
    email: string;
    name: string;
    role: string;
}

export const generateJWT = (payload: object, expiresIn: SignOptions['expiresIn'] = '24h'): string => {
    try {
        const options: SignOptions = {
            expiresIn,
            issuer: 'racoode-api',
            algorithm: 'HS256'
        };

        return jwt.sign(payload, configService.SECRET, options);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('Error generating JWT token:', message);
        throw new Error('Error generating authentication token');
    }
};

export const verifyToken = (token: string | null): object | null => {
    try {
        if (!token) {
            throw new Error('Token not provided');
        }

        const tokenParts = token.split(' ');
        const tokenValue = tokenParts.length === 2 ? tokenParts[1] : token;

        const decoded = jwt.verify(tokenValue, configService.SECRET) as CustomJwtPayload;
        
        return {
            id: decoded.id,
            email: decoded.email,
            name: decoded.name,
            role: decoded.role
        };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('Error verifying JWT token:', message);
        return null;
    }
};

export const extractToken = (req: any): string | null => {
    if (req.headers?.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    } else if (req.query?.token) {
        return req.query.token;
    } else if (req.cookies?.token) {
        return req.cookies.token;
    }
    return null;
};