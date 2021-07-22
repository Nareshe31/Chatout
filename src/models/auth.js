const db = require('../connection');
let model={}

model.getUser=async(email)=>{
    let userModel=await db.getUserCollection()
    let user=await userModel.findOne({email})
    if(user){
        return user
    }
    return null
}

model.createUser=async(userObj)=>{
    let userModel=await db.getUserCollection()
    let user=await userModel.insertMany([userObj])
    if(user[0]){
        return user[0]
    }
    return null
}

model.searchUser=async(name)=>{
    let pattern=new RegExp(name)
    let userModel=await db.getUserCollection()
    let users=await userModel.find({username:{$regex:pattern,$options:'i'}},{username:1,email:1})
    if(users){
        return users
    }
    else{
        return null
    }
}

module.exports=model