const model=require('../models/chat')
let services={}

services.getAllChats=async(userId)=>{
    let allchats=await model.getAllChats(userId)
    if(allchats){
        return {"chats":allchats.chats}
    }
    else{
        let err=new Error("Cannot get chats")
        err.status=400
        throw err
    }
}

services.getAllMessages=async(chatId)=>{
    let allMsgs=await model.getAllMessages(chatId)
    if(allMsgs){
        return {"messages":allMsgs.messages}
    }
    else{
        let err=new Error("Cannot get messages")
        err.status=400
        throw err
    }
}

services.sendMessage=async(details)=>{
    let msgObj={
        text:details.text,
        sender:details.sender,
        receiver:details.receiver
    }
    let addmsg=await model.addMessage(msgObj,details.chatId)
    if(addmsg){
        return {"message":"Message sent successfully","msg":addmsg}
    }
    else{
        let err=new Error("Cannot send message")
        err.status=400
        throw err
    }
}

services.createChat=async(details)=>{
    let chatObj={
        user1:details.sender,
        user2:details.receiver
    }
    let newChat=await model.createChat(chatObj,details.sender,details.receiver)
    if(newChat){
        return {"chat":newChat,"message":"Chat created successfully"}
    }
    else{
        let err=new Error("Cannot create chat")
        err.status=400
        throw err
    }
}

services.seeMessages=async(details)=>{
    let response=await model.seeMessage(details.sender,details.chatId)
    if(!response){
        let err=new Error("Message not seen")
        err.status=400
        throw err
    }
}

module.exports=services
