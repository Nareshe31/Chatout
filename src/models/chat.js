const db=require('../connection')
let models={}

models.getAllChats=async(userId)=>{
    let userModel=await db.getUserCollection()
    let chatModel=await db.getChatCollection()
    let messageModel=await db.getMessageCollection()
    let allchats=await userModel.findById(userId,{chats:1,_id:0}).populate({path:"chats.chat",model:"Chat",select:["last_message"],populate:{path:"last_message",model:"Message"}}).populate({path:"chats.with",model:"User",select:["username"]})
    if(allchats){
        return allchats
    }
    else{
        return null
    }
}

models.getAllMessages=async(chatId)=>{
    let chatModel=await db.getChatCollection()
    let messageModel=await db.getMessageCollection()
    let allMsgs=await chatModel.findById(chatId,{messages:1,_id:0}).populate('messages')
    if(allMsgs){
        return allMsgs
    }
    else{
        return null
    }
}

models.addMessage=async(messageObj,chatId)=>{
    let userModel=await db.getUserCollection()
    let chatModel=await db.getChatCollection()
    let messageModel=await db.getMessageCollection()
    let msg=await messageModel.insertMany([messageObj])
    if(msg){
        let chatMsg=await chatModel.findByIdAndUpdate(chatId,{$push:{"messages":msg[0]._id},"last_message":msg[0]._id})
        let newMsg=await userModel.findOneAndUpdate({_id:messageObj.receiver,"chats.chat":chatId},{$inc:{"chats.$.new_message":1}})
        if(chatMsg && newMsg){
            return msg[0]
        }
    }
    else{
        return null
    }
}

models.createChat=async(chat,user1,user2)=>{
    let userModel=await db.getUserCollection()
    let chatModel=await db.getChatCollection()
    let addChat=await chatModel.insertMany([chat])
    if(addChat){
        let user_1=await userModel.findByIdAndUpdate(user1,{$push:{"chats":{chat:addChat[0]._id,with:user2}}})
        let user_2=await userModel.findByIdAndUpdate(user2,{$push:{"chats":{chat:addChat[0]._id,with:user1}}})
        if(user1 && user2){
            return addChat[0]._id
        }
    }
    else{
        return null
    }
}

models.seeMessage=async(sender,chatId)=>{
    let userModel=await db.getUserCollection()
    let user=await userModel.findOneAndUpdate({_id:sender,"chats.chat":chatId},{"chats.$.new_message":0})
    if(user){
        return true
    }
    return null
}

module.exports=models