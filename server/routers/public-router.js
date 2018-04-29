import Router from 'koa-router'
import passport from 'koa-passport'
import logger from '../logger'
import {UserModel} from "../models"
import AppError from '../AppError'
import {LOGIN_FAILED} from '../errorcodes'


/**
 * All authentication releated APIs would go here
 * @type {Router}
 */


const publicRouter = new Router()

publicRouter.post('/login', async (ctx, next) => {
    await passport.authenticate('local', (err, user, info, status) => {
        if (err) {
            return next(err)
        }
        if (!user) {
            console.log("***info***", info, "*****status*****", status)
            throw new AppError(info.message, LOGIN_FAILED, 401)
        }

        // remove password information from user
        user.password = undefined
        ctx.loggedInUser = user;


    })(ctx, next)

    await ctx.login(ctx.loggedInUser)
    return ctx.loggedInUser
})

publicRouter.post('/register', async ctx => {
        return await UserModel.saveUser(ctx.request.body)
    }
)

export default publicRouter