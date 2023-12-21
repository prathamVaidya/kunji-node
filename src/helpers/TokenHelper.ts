import jwt from 'jsonwebtoken'
import Config from '../config'
import { AccessTokenPayload } from '../types';

export const verifyAccessToken = (token: string, appId: string, publicKey: string) => {
    return jwt.verify(token, publicKey, {
      issuer: Config.JWT_TOKEN_ISSUER_NAME,
      audience: appId,
      algorithms: ['RS256'],
    }) as AccessTokenPayload;
  };
  
export const verifyRefreshToken = (token: string, appId: string, publicKey: string) => {
    return jwt.verify(token, publicKey, {
      issuer: Config.JWT_TOKEN_ISSUER_NAME,
      audience: appId,
      algorithms: ['RS256'],
    });
  };