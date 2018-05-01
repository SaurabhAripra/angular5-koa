import Koa from 'koa'
import Router from 'koa-router'
import koaBody from 'koa-body'
import views from 'koa-views'
import cookie from 'koa-cookie'
import staticCache from 'koa-static-cache'
import passport from 'koa-passport'
import koaSession from 'koa-session'
import noConfig from 'no-config'
import confFile from './config'
import co from 'co'
import mongoose from 'mongoose'
import {userRouter} from "./routers"
import {UserModel} from "./models"
import {PROD_ENV, DEV_ENV, ROLE_ADMIN,ROLE_SUPER_ADMIN} from "./serverconstants"
import path from 'path'
import logger from './logger'
import {apiRouter, pageRouter} from "./routers"

// Initializing configuration first and then starting application
co(async () => {
    let conf = await noConfig({config: confFile})

    try {
        mongoose.Promise = global.Promise
        await mongoose.connect(conf.mongo.url, {

        })
        logger.info("Connection to database Successful!")
    } catch (error) {
        logger.error("Error connecting to database, please check your configurations...")
        return
    }

    if (conf.server.createAdmin) {
        if (!await UserModel.exists('admin@test.com')) {

            // create user
            await UserModel.saveUser({
                email: 'admin@test.com',
                firstName: "Administrator",
                roles: [{role: ROLE_ADMIN}],
                password: "admin"
            })


            logger.info("#### CREATED ADMIN USER FOR TESTING ####")
            logger.info("LOGIN USING admin@test.com/admin")
        }

        if (!await UserModel.exists('superadmin@test.com')) {

            // create user
            await UserModel.saveUser({
                email: 'superadmin@test.com',
                firstName: "Super",
                lastName: "Administrator",
                roles: [{role: ROLE_SUPER_ADMIN}],
                password: "admin"
            })


            logger.info("#### CREATED SUPER ADMIN USER FOR TESTING ####")
            logger.info("LOGIN USING superadmin@test.com/admin")
        }
    }


    let app = new Koa()
    app.use(cookie())
    app.use(koaBody({multipart: true, formidable: {keepExtensions: true}}))
    app.keys = ['A secret that no one knows']
    app.use(koaSession({}, app))

// authentication
    require('./auth')
    app.use(passport.initialize())
    app.use(passport.session())

// Mustache would be used as a template engine to render pages
    app.use(views(__dirname + '/views',
        {
            map: {
                html: 'mustache'
            },
            extension: 'mustache',
            debug: true,
            options: {
                partials: {
                    header: 'header'
                }
            }
        }
    ));

    console.log("dir name is ", __dirname)

    // Cache public resources on production

    if (process.env.NODE_ENV && process.env.NODE_ENV == PROD_ENV) {
        // Public files would be served from public folder (js,css, images etc), with max age as 1 year
        app.use(staticCache(path.join(__dirname, 'public'), {
            maxAge: 365 * 24 * 60 * 60
        }))
    } else {
        // For dev environment no caching of files would be done
        app.use(staticCache(path.join(__dirname, 'public'), {
            maxAge: 0
        }))
    }

    /**
     * Below code is error handler code which would receive both errors and success response
     */

    app.use(async (ctx, next) => {
        try {
            let response = await next()
            if (response !== undefined) {
                ctx.body = {
                    success: true,
                    data: response
                }
            }

        } catch (err) {
            logger.error("Server ERROR:", {error: err})
            ctx.status = err.status || 500;
            ctx.body = ctx.body = {
                success: false,
                code: err.code
            }
            ctx.app.emit('error', err, ctx);
        }
    });

    app.use(function (ctx, next) {
        ctx.flash = function (type, msg) {
            ctx.session.flash = {type: type, message: msg};
        }
        return next();
    });


    // All APIs starts with /api, api router is kept before page router as page router would return index page on all url
    // hence it api router is kept before to ensure that get call on api returns appropriate result and not index page
    app.use(apiRouter.routes())

    // All server pages (including server side rendering pages)
    app.use(pageRouter.routes())


  app.listen(conf.server.port, () => {
        logger.info('Server started on %s', conf.server.port)
    })
})
