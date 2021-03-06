import Router from 'koa-router'
import passport from 'koa-passport'
import logger from '../logger'
import {UserModel, RoleModel} from "../models"
import AppError from '../AppError'
import {LOGIN_FAILED} from '../errorcodes'
import {ROLE_APP_USER} from '../serverconstants'


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
        let user = ctx.request.body
        let modifiedRole = {}
        let role = await RoleModel.find({name: ROLE_APP_USER}).lean()
        modifiedRole.name = role[0].name
        modifiedRole._id = role[0]._id
        user.roles = [modifiedRole]

        return await UserModel.saveUser(user)
    }
)

publicRouter.get('/execute', async ctx => {
    console.log("execute query")
    /*
    return await UserModel.create({
        "firstName": "Test1",
        "lastName": "Test1",
        "roles": [{
            "name": "Super Admin"

        }, {
            "name": "Negotiator"
        }],
        "email": "test1@test.com",
        "password": "abcdef"
    })
    */
    //return await UserModel.find({})
    //return await UserModel.findOne({email:'admin@test.com'})
    //return await UserModel.findOne({email:'admin@test.com'},{firstName:1, lastName:1})
//    return await UserModel.find({"roles.name":{$in:'Estimator'}})
    //return await UserModel.findOneAndUpdate({email:'schouhan@aripratech.com'}, {$set:{'firstName':'Ekaksh'}}, {new:true})


    return await UserModel.aggregate({
        $match: {email: 'schouhan@aripratech.com'}
    }, {
        $unwind: {
            path: "$roles"
        }
    }, {
        $lookup: {
            from: 'roles',
            localField: 'roles._id',
            foreignField: '_id',
            as: 'roles'
        }
    }, {
        $group: {
            _id: "$_id",
            email: {$first: "$email"},
            firstName: {$first: "$firstName"},
            lastName: {$first: "$lastName"},
            roles: {$push: {$arrayElemAt: ["$roles", 0]}}
            //roles: {"$roles", 0]}}
        }
    }).exec()


})

export default publicRouter