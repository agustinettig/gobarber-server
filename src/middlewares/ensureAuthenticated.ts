import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '../config/AuthConfig';

interface TokenPayload {
    sub: string;
}

export default function ensureAuthenticated(request: Request, response: Response, next: NextFunction): void {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        throw Error('Missing auth token');
    }

    const [, token] = authHeader.split(' ');

    try {
        const decoded = verify(token, authConfig.jwt.secret);

        const { sub } = decoded as TokenPayload;

        request.user = {
            id: sub,
        };

        return next();
    } catch {
        throw Error('Invalid JWT token');
    }
}
