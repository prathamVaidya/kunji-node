import ErrorMessage from '../constants/ErrorMessage'
import { Response, NextFunction } from 'express';
import { AuthRequest, KunjiMiddlewares } from '../types';
import { verifyAccessToken } from '../helpers/TokenHelper';

const MiddlewareFactory = (appId: string, publicKey: string) : KunjiMiddlewares => {
    return {
            AuthMiddleware : async (req: AuthRequest, res: Response, next: NextFunction) => {

            if(!appId || !publicKey){
                console.error('Kunji Error: AppID and PublicKey is required. Set KUNJI_APP_ID and KUNJI_PUBLIC_KEY or use the default import and initialize there')
                return res.status(500).send(ErrorMessage.STATUS_500_KUNJI_NOT_CONFIGURED);
            }

            const headerToken = req.headers.authorization;
        
            if (!headerToken) {
                return res.status(401).send(ErrorMessage.STATUS_401_NO_TOKEN);
            }
        
            if (headerToken && headerToken.split(' ')[0] !== 'Bearer') {
                return res.status(401).send(ErrorMessage.STATUS_401_NO_TOKEN);
            }
        
            const token = headerToken.split(' ')[1];
        
            try {
                const decodedValue = verifyAccessToken(token, appId, publicKey);
        
                if (decodedValue) {
                    // req.user = decodedValue;
                    console.log(req.user);
                    return next();
                }
        
                return res.status(401).send(ErrorMessage.STATUS_401_INVALID_TOKEN);
            } catch (error) {
                // console.log(error)
                return res.status(401).send(ErrorMessage.STATUS_401_INVALID_TOKEN);
            }
        }
    }
}



export default MiddlewareFactory

/* Use Environment Variable */
const service = MiddlewareFactory(process.env.KUNJI_APP_ID ?? '', process.env.KUNJI_PUBLIC_KEY ?? '');

export const AuthMiddleware = service.AuthMiddleware