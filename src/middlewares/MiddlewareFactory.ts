import ErrorMessage from '../constants/ErrorMessage'
import { Response, NextFunction } from 'express';
import { AuthRequest, KunjiMiddlewares, UnauthorizedErrorI, UnauthorizedResponseI } from '../types';
import { verifyAccessToken } from '../helpers/TokenHelper';
import { decodeBase64 } from '../helpers';

const MiddlewareFactory = (appId: string, publicKeyBase64: string, config: { debug?: boolean, unauthorizedResponse?: (type: UnauthorizedErrorI) => UnauthorizedResponseI } = { }) : KunjiMiddlewares => {
    const publicKey = decodeBase64(publicKeyBase64) // Decode the Base-64

    // Priority to Config object -> env KUNJI_ENABLE_DEBUG -> default false
    const debug = (log: unknown, isError: boolean = false) => {
        if((config.debug == undefined ? (process.env.KUNJI_ENABLE_DEBUG == 'true' ?? false) : config.debug)){
            // if true
            console.debug(`KUNJI-${(isError ? 'ERROR' : 'LOG')} :`, log)
        }
    }

    const generateUnauthorizedResponse = (type : UnauthorizedErrorI) : UnauthorizedResponseI => {
        if(config.unauthorizedResponse){
            return config.unauthorizedResponse(type);
        }
        return {statusCode: 401, body: { error: true, message: type === 'INVALID_TOKEN' ? ErrorMessage.STATUS_401_INVALID_TOKEN : ErrorMessage.STATUS_401_NO_TOKEN}};
    }

    return {
            AuthMiddleware : async (req: AuthRequest, res: Response, next: NextFunction) => {

            if(!appId || !publicKey){
                console.error('Kunji Error: AppID and PublicKey is required. Set KUNJI_APP_ID and KUNJI_PUBLIC_KEY or use the default import and initialize there')
                return res.status(500).send({
                    error: true,
                    message: ErrorMessage.STATUS_500_KUNJI_NOT_CONFIGURED
                });
            }

            const headerToken = req.headers.authorization;
            const unAuthErrorNoToken = generateUnauthorizedResponse('NO_TOKEN');
        
            if (!headerToken || headerToken && headerToken.split(' ')[0] !== 'Bearer') {
                if(unAuthErrorNoToken.xml){
                    res.setHeader('Content-Type', 'application/xml');
                }
                return res.status(unAuthErrorNoToken.statusCode).send(unAuthErrorNoToken.body);
            }
        
            const token = headerToken.split(' ')[1];
            const unAuthErrorInvalidToken = generateUnauthorizedResponse('INVALID_TOKEN');
        
            try {
                const decodedValue = verifyAccessToken(token, appId, publicKey);
        
                if (decodedValue) {
                    req.user = decodedValue;
                    debug(req.user);
                    return next();
                }
        
                if(unAuthErrorInvalidToken.xml){
                    res.setHeader('Content-Type', 'application/xml');
                }
                return res.status(unAuthErrorInvalidToken.statusCode).send(unAuthErrorInvalidToken.body);
            } catch (error) {
                debug(error)
                if(unAuthErrorInvalidToken.xml){
                    res.setHeader('Content-Type', 'application/xml');
                }
                return res.status(unAuthErrorInvalidToken.statusCode).send(unAuthErrorInvalidToken.body);
            }
        }
    }
}



export default MiddlewareFactory

/* Use Environment Variable */
const service = MiddlewareFactory(process.env.KUNJI_APP_ID ?? '', process.env.KUNJI_PUBLIC_KEY ?? '');

export const AuthMiddleware = service.AuthMiddleware