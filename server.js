const express=require('express')
const { env } = require('process')
const app=express()
const cors=require('cors')
const http = require("http");
const socketIo = require('socket.io');
require('dotenv').config()
const port=process.env.PORT
const fs = require('fs');
const middleware=require('./src/middleware')

const router = require('./src/routes/auth');
const chat=require('./src/routes/chat')
const server = http.createServer(app);
const io = socketIo(server,{
  cors:{
    origin:"*",
    methods:["GET","POST"]
  }
});
let connectedUsers=[]
app.use(cors(),express.json())
app.use('/api',router)
app.use('/chat',middleware,chat)
io.on('connection',socket=>{
    // connectedUsers.push(socket.id)
    // console.log(connectedUsers);
    // socket.broadcast.emit('update-list', { ids: connectedUsers })
    socket.on('disconnect',()=>{
        connectedUsers=connectedUsers.filter(_=>_!==socket.id)
        socket.broadcast.emit('update-list', { ids: connectedUsers })
    })
    // socket.on('media-Offer', data => {
    //     socket.to(data.to).emit('mediaOffer', {
    //       from: data.from,
    //       offer: data.offer,
    //       name:data.name
    //     });
    //   });
      
    //   socket.on('mediaAnswer', data => {
    //     socket.to(data.to).emit('mediaAnswer', {
    //       from: data.from,
    //       answer: data.answer,
    //       name:data.name
    //     });
    //   });
    
    //   socket.on('iceCandidate', data => {
    //     socket.to(data.to).emit('remotePeerIceCandidate', {
    //       candidate: data.candidate
    //     })
    //   })

    //   socket.on('send-msg',data=>{
    //     socket.to(data.to).emit('receive-msg',{
    //       from:data.from,
    //       msg:data.msg
    //     })
    //   })
      socket.on('join',data=>{
        socket.join(data.room)
      })
      socket.on('send-message',data=>{
        socket.to(data.receiver).emit('receive-message',data)
      })
      socket.on('new-chat',data=>{
        socket.to(data.receiver).emit('new-chat',data)
      })
})

if(process.env.NODE_ENV==='production')
{
    app.use(express.static('client/build'))
    const path=require('path')
    console.log("Required")
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
        
    })
}

app.use(async(err,req,res,next)=>{
  fs.appendFileSync('errorLogger.txt',`Error: ${err.stack}\t\tURL: ${req.url}\t\tTime: ${new Date()}\n`,(error)=>{
    if(error){
      console.log(error);
    }
  })
  if(err.status){
    res.status(err.status)
  }
  else{
    res.status(400)
  }
  console.log(err);
  res.send({message:err.message})
})
server.listen(port,()=>{
    console.log(`Server is running at ${port}`);
})
