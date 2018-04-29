import Router from 'koa-router'
import {publicRouter, userRouter} from "./"
import {isAuthenticated, isAdmin, isSuperAdmin} from "../utils"
import AppError from '../AppError'
import {ACCESS_DENIED} from "../errorcodes"

/**
 * This router would contain all API routes
 * @type {Router}
 */


const apiRouter = new Router({
    prefix:"/api"
})

// public URLs
apiRouter.use(publicRouter.routes())

apiRouter.use((ctx, next) => {
    if (isAuthenticated(ctx))
        return next()
    throw new AppError("Access Denied", ACCESS_DENIED, 403)
}, userRouter.routes())


export default apiRouter