import './App.css';
import {Component} from 'react';
import socketClient from 'socket.io-client'

var socket;
var peer;
var selectedUser
class App extends Component{
  state={
    name:'',
    msgs:[]
  }
  getMediaStream=async()=>{
    try {
      let stream=await navigator.mediaDevices.getUserMedia({video:true,audio:true})
      const videoElement = document.querySelector('video#localVideo');
      videoElement.srcObject = stream;
      stream.getTracks().forEach(track =>{ 
        peer.addTrack(track, stream)});
    } catch (error) {
      console.log('Error',error);
    }
  }
  componentWillMount(){
    const createPeerConnection = () => {
      return new RTCPeerConnection({'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]});
    };
    peer = createPeerConnection();
    socket = socketClient('http://localhost:5000', { transports: ["websocket"] });
    socket.on('connect',()=>{
      this.getMediaStream()
      socket.emit('message',{
        id:socket.id
      })
    })
  }

  sendMessage=()=>{
    console.log("sending");
    socket.emit('send-msg',{
      to:selectedUser,
      from:socket.id,
      msg:this.state.name
    })
  }
  render(){
    const makeCall=async()=>{
      try {
        console.log('Make call');
        const peerOffer=await peer.createOffer()
        await peer.setLocalDescription(new RTCSessionDescription(peerOffer))
        socket.emit('media-Offer',{
          from:socket.id,
          offer:peerOffer,
          to:selectedUser,
          name:this.state.name
        })
      } catch (error) {
        
      }
    }

    socket.on('update-list',(data)=>{
      const usersList = document.querySelector('#usersList');
      const usersToDisplay = data.ids.filter(id => id !== socket.id);

      usersList.innerHTML = '';
      
      usersToDisplay.forEach(user => {
        const userItem = document.createElement('div');
        userItem.innerHTML = user;
        userItem.className = 'user-item';
        userItem.addEventListener('click', () => {
          const userElements = document.querySelectorAll('.user-item');
          userElements.forEach((element) => {
            element.classList.remove('user-item--touched');
          })
          userItem.classList.add('user-item--touched');
          selectedUser = user;
        });
        usersList.appendChild(userItem);
      });
    })
    socket.off('mediaAnswer').on('mediaAnswer',async(data)=>{
      try {
        console.log('Media Answer',data);
        document.querySelector('p#remoteName').innerHTML=data.name
        await peer.setRemoteDescription(new RTCSessionDescription(data.answer))
      } catch (error) {
        console.log(error.message);
      }
    })
    socket.off('mediaOffer').on('mediaOffer',async(data)=>{
      try {
        console.log('Media Offer',data);
        document.querySelector('p#remoteName').innerHTML=data.name
        await peer.setRemoteDescription(new RTCSessionDescription(data.offer))
        const peerAnswer=await peer.createAnswer()
        await peer.setLocalDescription(new RTCSessionDescription(peerAnswer))
        socket.emit('mediaAnswer',{
          from:socket.id,
          to:data.from,
          answer:peerAnswer,
          name:this.state.name
        })
      } catch (error) {
        console.log(error.message);
      }
    })
    socket.on('remotePeerIceCandidate',async(data)=>{
      try {
        console.log('Remote candidate',data);
        const candidate=new RTCIceCandidate(data.candidate)
        await peer.addIceCandidate(candidate)
      } catch (error) {
        console.log(error.message);
      }
    })

    peer.addEventListener('track',(event)=>{
      console.log('Track',event.track);
      const remoteStream=new MediaStream()
      remoteStream.addTrack(event.track,remoteStream)
      document.querySelector('video#remoteVideo').srcObject=remoteStream
    })

    peer.onicecandidate=(event)=>{
      console.log('On ice candidate',event);
      socket.emit('iceCandidate', {
        to: selectedUser,
        candidate: event.candidate,
      });
    }
    peer.onsignalingstatechange=()=>{
      console.log('Signal changed');
    }
    peer.oniceconnectionstatechange=()=>{
    
    }

    socket.off('receive-msg').on('receive-msg',data=>{
      console.log("Receiving msg");
      let msgDum=this.state.msgs
      msgDum.push(data.msg)
      this.setState({msgs:msgDum})
    })

    return(
      <div className='mt-3 container'>
        <div className='row'>
          <div className='col-md-6 offset-md-3 col-sm-12 d-flex flex-column'>
            <input value={this.state.name} onChange={(e)=>this.setState({name:e.target.value})} className='form-control'></input>
            <button onClick={this.sendMessage} className='btn btn-primary btn-small' >Send</button>
            <button onClick={makeCall} className='btn btn-primary btn-small' >Call</button>
            <div id='usersList'></div>
            <div id='msgList'>{this.state.msgs.map((_,i)=><p style={{margin:'0px'}} key={i}>{_}</p>)}</div>
            <video id='localVideo' muted playsInline autoPlay controls={false} className='m-3'></video>
            <p id='remoteName' className='text-center font-weight-bolder'></p>
            <video id='remoteVideo' playsInline autoPlay controls={false} className='m-3'></video>
          </div>
        </div>
      </div>
    )
  }
}

export default App;
