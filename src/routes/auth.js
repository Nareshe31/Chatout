const express = require('express');
const router=express.Router()
const service=require('../services/auth')

router.post('/login',async(req,res,next)=>{
    try {
        let {email,password}=req.body
        let response=await service.loginUser(email,password)
        res.send(response)
    } catch (error) {
        next(error)
    }
})

router.post('/signup',async(req,res,next)=>{
    try {
        let response=await service.signupUser(req.body)
        res.send(response)
    } catch (error) {
        next(error)
    }
})

router.get('/search/:name',async(req,res,next)=>{
    try {
        let response=await service.searchUser(req.params.name)
        res.send(response)
    } catch (error) {
        console.log(error);
        next(error)
    }
})

router.get('/user-details/:token',async(req,res,next)=>{
    try {
        let response=await service.getUser(req.params.token)
        res.send(response)
    } catch (error) {
        next(error)
    }
})

module.exports=router;