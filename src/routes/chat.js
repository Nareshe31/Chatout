const express = require('express');
const router=express.Router()
const service=require('../services/chat')
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

router.get('/all-chats/:userId',async(req,res,next)=>{
    try {
        let response=await service.getAllChats(req.params.userId)
        res.send(response)
    } catch (error) {
        next(error)
    }
})

router.get('/all-messages/:chatId',async(req,res,next)=>{
    try {
        let response=await service.getAllMessages(req.params.chatId)
        res.send(response)
    } catch (error) {
        next(error)
    }
})

router.post('/send-message',async(req,res,next)=>{
    try {
        let response=await service.sendMessage(req.body)
        res.send(response)
    } catch (error) {
        next(error)
    }
})

router.post('/create-chat',async(req,res,next)=>{
    try {
        let response=await service.createChat(req.body)
        res.send(response)
    } catch (error) {
        next(error)
    }
})

router.post('/see-message',async(req,res,next)=>{
    try {
        let response=await service.seeMessages(req.body)
        res.send(response)
    } catch (error) {
        next(error)
    }
})

router.post('/upload',upload.single('image'),async(req,res,next)=>{
    try {
        res.send({message:"successfully uploaded",filename:req.file.filename+"img"})
    } catch (error) {
        next(error)
    }
})

module.exports=router