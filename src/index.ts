'use strict';

import MiddlewareFactory, {AuthMiddleware} from './middlewares/MiddlewareFactory';
import {AuthRequest} from './types'

export default MiddlewareFactory
export {
	AuthMiddleware,
	AuthRequest
}