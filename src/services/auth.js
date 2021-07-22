const model = require('../models/auth');
const jwt=require("jsonwebtoken")
let service = {}

service.loginUser = async (email, password) => {
    let user = await model.getUser(email)
    if (user) {
        if (user.password == password) {
            const token=jwt.sign({_id:user._id,email:user.email},process.env.JWT_SECRET)
            return { "user": { username: user.username, email: user.email, _id: user._id }, message: "Login successful","token":token}
        }
        else {
            let err = new Error("Email or password is incorrect")
            err.status = 400
            throw err
        }
    }
    else {
        let err = new Error("User does not exist")
        err.status = 400
        throw err
    }
}

service.signupUser = async (userObj) => {
    let user = await model.getUser(userObj.email)
    if (user) {
        let err = new Error("User already exists with this email-id")
        err.status = 400
        throw err
    }
    else {
        let created = await model.createUser(userObj)
        if (created) {
            return { message: "Signup is successfull" }
        }
        else {
            let err = new Error("Something went wrong while creating a new user")
            err.status = 400
            throw err
        }
    }
}

service.searchUser = async (name) => {
    let users = await model.searchUser(name)
    if (users) {
        return { users }
    }
    else {
        let err = new Error("Something went wrong while searching for user")
        err.status = 400
        throw err
    }
}

service.getUser=async(token)=>{
    try {
        const payload=await jwt.verify(token,process.env.JWT_SECRET)
        const {email}=payload
        let user = await model.getUser(email)
        return { "user": { username: user.username, email: user.email, _id: user._id }}
    } catch (error) {
        let err = new Error("Login to proceed")
        err.status = 401
        throw err
    }
    
}

module.exports = service