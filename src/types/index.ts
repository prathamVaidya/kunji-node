import { Request, RequestHandler } from 'express';


export interface AccessTokenPayload {
    uid: string,
    role: string,
    iss: string,
    aud: string,
    iat: number,
    exp: number
}

export type AuthRequest = Request & {user?: AccessTokenPayload}

export interface KunjiMiddlewares {
    AuthMiddleware : RequestHandler
}

export type UnauthorizedErrorI = 'NO_TOKEN' | 'INVALID_TOKEN'

export type UnauthorizedResponseI = { statusCode: number, body: object | string, xml?: boolean}

