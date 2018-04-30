import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'
import _ from 'lodash'
import * as ErrorCodes from '../errorcodes'
import AppError from '../AppError'
import logger from '../logger'

mongoose.Promise = global.Promise

let userSchema = mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: String,
    email: {type: String, required: true},
    password: {type: String, required: true},
    roles: [{
        role: {type: String, required: true}
    }],
    isDeleted: {type: Boolean, default: false}
})


userSchema.statics.saveUser = async usrObj => {
    if (!usrObj.email)
        throw new Error("User's email must be passed to save user")
    if (!usrObj.password)
        throw new Error("User's password must be passed to save user")

    let count = await UserModel.count({email: usrObj.email})
    if (count !== 0)
        throw new Error("Email already registered with another user")

    usrObj.password = await bcryptjs.hash(usrObj.password, 10)
    return await UserModel.create(usrObj)
}

userSchema.statics.verifyUser = async (email, password) => {
    if (_.isEmpty(email))
        throw new Error("User's email must be passed to verify user")
    if (_.isEmpty(password))
        throw new Error("User's password must be passed to verify user")

    console.log("finding user with email")
    let user = await UserModel.findOne({email: email}).lean()

    if (user) {
        return user
    } else {
        return false
    }
}

userSchema.statics.editUser = async userObj => {
    console.log("user object ", userObj)

    // Find object by passed id
    let storedUser = await UserModel.findById(userObj._id)

    /* See if email is changed, if yes then see if email is already associated with another user */

    console.log("stored ", storedUser.email)
    console.log("user obj ", userObj.email)

    if (storedUser.email != userObj.email) {
        let count = await UserModel.count({_id: {'$ne': mongoose.Schema.ObjectId(userObj._id)}, 'email': userObj.email})
        if (count != 0) {
            throw new AppError("Email already used ", ErrorCodes.EMAIL_ALREADY_USED)
        }
    }

    if (userObj.password) {
        // clear password as we will not change password in this call
        delete userObj['password']
    }

    return await UserModel.findByIdAndUpdate(userObj._id, {$set: userObj}, {new: true}).exec()

}

userSchema.statics.exists = async email => {
    if (!email)
        return false
    let count = await UserModel.count({'email': email})
    if (count > 0)
        return true
    return false
}


const UserModel = mongoose.model("User", userSchema)
export default UserModel
