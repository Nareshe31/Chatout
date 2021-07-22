const mongoose = require('mongoose');
mongoose.Promise=global.Promise
const Schema=mongoose.Schema

const userSchema=new Schema({
    username:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    chats:[{
        chat:{
            type:Schema.Types.ObjectId,
            ref:"Chat"
        },
        new_message:{
            type:Number,
            default:0
        },
        with:{
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    }]
},{collection:"User"})

const chatSchema=new Schema({
    user1:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    user2:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    messages:[{
        type:Schema.Types.ObjectId,
        ref:"Message"
    }],
    last_message:{
        type:Schema.Types.ObjectId,
        ref:"Message"
    }
},{collection:"Chat"})

const messageSchema=new Schema({
    sender:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    text:{
        type:String
    },
    sent_At:{
        type:Date,
        default:Date.now
    }
},{collection:"Message"})

let collection={}

collection.getUserCollection=async()=>{
    try {
        return (await mongoose.connect(process.env.mongoURI,{useNewUrlParser:true,useUnifiedTopology:true})).model('User',userSchema)
    } catch (error) {
        let err=new Error("Cannot connect to mongodb")
        err.status=400
        throw err
    }
}

collection.getChatCollection=async()=>{
    try {
        return (await mongoose.connect(process.env.mongoURI,{useNewUrlParser:true,useUnifiedTopology:true})).model('Chat',chatSchema)
    } catch (error) {
        let err=new Error("Cannot connect to mongodb")
        err.status=400
        throw err
    }
}

collection.getMessageCollection=async()=>{
    try {
        return (await mongoose.connect(process.env.mongoURI,{useNewUrlParser:true,useUnifiedTopology:true})).model('Message',messageSchema)
    } catch (error) {
        let err=new Error("Cannot connect to mongodb")
        err.status=400
        throw err
    }
}
module.exports=collection