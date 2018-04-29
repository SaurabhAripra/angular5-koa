import Router from 'koa-router'
import {UserModel} from "../models"
import * as ErrorCodes from '../errorcodes'

const userRouter = new Router()

userRouter.put('/users', async ctx => {
    let editedUser = await UserModel.editUser(ctx.request.body)
    return editedUser
})

userRouter.get('/users', async ctx => {
    return await UserModel.find().exec()
})

export default userRouter