import axios from 'axios';
import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Picker from 'emoji-picker-react';
// import {isMobile} from 'react-device-detect'
import { URL,getTime,months,datesAreOnSameDay} from "../../utils/allFunctions";

class ChatBox extends Component{

    constructor(props) {
        super(props)
        this.state={
            text:"",
            openEmoji:false,
            currentDate:(this.props.allMessages.length>0?new Date(this.props.allMessages[0].sent_At):null)
        }
    }
    componentDidMount(){
        this.scrollToLast()
        var chatBody=document.getElementById('chat-body')
        var msgDate=document.getElementById('message-date')
        var scrollTimer=-1
        chatBody.onscroll=(e)=>{
            msgDate.classList.add("show")
            if(scrollTimer!==-1){
                window.clearTimeout(scrollTimer)
            }
            scrollTimer=window.setTimeout(()=>{
                msgDate.classList.remove("show")
            },750)
            this.props.allMessages.map((_,i)=>{
                if(this.checkInView(chatBody,document.getElementById(i))){
                    this.setState({currentDate:(new Date(this.props.allMessages[i].sent_At))})
                }
            })
        }
        chatBody.onclick=()=>{
            if(this.state.openEmoji){
                this.setState({openEmoji:false})
            }
        }
    }
    componentDidUpdate(prevProps){
        if(prevProps!==this.props){
            this.scrollToLast()
        }
    }
    scrollToLast=()=>{
        var chatBody=document.getElementById('chat-body')
        chatBody.scrollTop=chatBody.scrollHeight
    }
    checkInView=(container, element, partial)=>{
        //Get container properties
        let cTop = container.scrollTop;
        // let cBottom = cTop + container.clientHeight;
    
        //Get element properties
        let eTop = element.offsetTop - container.offsetTop; // change here
        // let eBottom = eTop + element.clientHeight;
        //Check if in view    
        // let isTotal = (eTop >= cTop && eBottom <= cBottom);
        let isTotal= ( (eTop-70)<cTop) && ((eTop+20)>cTop)
        // let isPartial = partial && (
        //   (eTop < cTop && eBottom > cTop) ||
        //   (eBottom > cBottom && eTop < cBottom)
        // );
    
        //Return outcome
        // return  (isTotal  || isPartial);
        return isTotal
      }
    render(){
        let prevDate=new Date("2000/4/21")
        const messageBox=(message,i)=>{
            let date=false
            if(!datesAreOnSameDay((new Date(message.sent_At)),prevDate)){
                date=true
                prevDate=new Date(message.sent_At)
            }
            const isLink=(message)=>{
                var exp=new RegExp(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/)
                return message.match(exp)
            }
            return(
                <Fragment key={message._id}>
                {date ?
                    <div className="date">
                        {
                            !datesAreOnSameDay( 
                                new Date(message.sent_At),
                                new Date())
                                ?
                                (months[(new Date(message.sent_At)).getMonth()]+" "+(new Date(message.sent_At)).getDate()+( ( (new Date(message.sent_At)).getFullYear() !== (new Date().getFullYear()) ) ? ( ", "+ (new Date(message.sent_At)).getFullYear() ):'') ) :"Today"
                        }
                    </div>
                    :null
                }
                <div key={i} id={i} className={ ( i===(this.props.allMessages.length-1) || ( (message.sender!==this.props.allMessages[i+1].sender)? true : (!datesAreOnSameDay( (new Date(message.sent_At)),(new Date(this.props.allMessages[i+1].sent_At)) )) ) ) ? (message.sender===this.props.user._id?"message border-design right":"message border-design left"):(message.sender===this.props.user._id?"message right":"message left")}>
                    {isLink(message.text)?<a href={message.text} target="_blank" rel="noreferrer">{message.text}</a>:<p>{message.text}</p>}
                    <span className="time">{getTime(message.sent_At)}</span>
                </div>
                </Fragment>
            )
        }
        const imageBox=(message,i)=>{
            let date=false
            if(!datesAreOnSameDay((new Date(message.sent_At)),prevDate)){
                date=true
                prevDate=new Date(message.sent_At)
            }
            return (
                <Fragment>
                    {date ?
                        <div className="date">
                            {
                                !datesAreOnSameDay( 
                                    new Date(message.sent_At),
                                    new Date())
                                    ?
                                    (months[(new Date(message.sent_At)).getMonth()]+" "+(new Date(message.sent_At)).getDate()+( ( (new Date(message.sent_At)).getFullYear() !== (new Date().getFullYear()) ) ? ( ", "+ (new Date(message.sent_At)).getFullYear() ):'') ) :"Today"
                            }
                        </div>
                        :null
                    }
                    <div id={i} onClick={()=>openPreview(message.text.slice(0,message.text.length-3))} className={message.sender===this.props.user._id?"image right":"image left"}>
                        <img src={message.text.slice(0,message.text.length-3)} alt="loading" />
                        <p className="time">{getTime(message.sent_At)}</p>
                    </div>
                </Fragment>
                
            )
        }
        const handleSubmit=async(e)=>{
            try {
                e.preventDefault()
                if(this.state.text!==""){
                    if (this.props.allMessages.length>0) {
                        let message=await sendMessage(this.state.text,this.props.currentChat.chat._id)
                        this.props.addMessage(message)
                        this.props.socket.emit('send-message',{
                            message,
                            sender:this.props.user,
                            chatId:this.props.currentChat.chat._id,
                            receiver:this.props.currentChat.with._id
                        })
                        this.setState({text:""})
                    } else {
                        let chat=await createChat()
                        let message=await sendMessage(this.state.text,chat)
                        let newC={
                            _id:chat,
                            last_message:message
                        }
                        let newChat={
                            "chat":newC,
                            with:this.props.user,
                            new_message:1
                        }
                        this.props.newChat(chat,message)
                        this.props.socket.emit('new-chat',{
                            message,
                            sender:this.props.user,
                            chat:newChat,
                            receiver:this.props.currentChat.with._id
                        })
                        this.setState({text:""})
                    }
                }
            } catch (error) {
                if(error.response){
                    console.log(error.response.data);
                }
                else{
                    console.log(error.stack);
                }
            }
        }
        const sendMessage=async(text,chatId)=>{
            let response=await axios.post(URL+"/chat/send-message/",{
                text,
                sender:this.props.user._id,
                receiver:this.props.currentChat.with._id,
                chatId
            },
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem("token")
                }
            })
            return response.data.msg
        }
        const createChat=async()=>{
            let response=await axios.post(URL+"/chat/create-chat",{
                sender:this.props.user._id,
                receiver:this.props.currentChat.with._id
            },
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem("token")
                }
            })
            return response.data.chat
        }
        const emojiClick=(event,emojiObj)=>{
            let message=this.state.text+emojiObj.emoji
            document.getElementById('messagebar').focus()
            this.setState({text:message})
        }
        const handleMedia=async(event)=>{
            try {
                let file=event.target.files
                let fileData=new FormData()
                fileData.append("file",file[0])
                fileData.append("upload_preset","web-chat")
                fileData.append("cloud_name","dkmxj6hie")

                var chatBody=document.getElementById('chat-body')
                var load=document.createElement("i")
                load.classList.add("loading")
                var loadicon=document.createElement("i")
                loadicon.classList.add("bi")
                loadicon.classList.add("bi-arrow-clockwise")
                load.id=this.props.allMessages.length
                load.appendChild(loadicon)
                chatBody.appendChild(load)

                let response=await axios.post("https://api.cloudinary.com/v1_1/dkmxj6hie/image/upload",fileData)
            //     let response=await axios.post(URL+"/chat/upload",formData,{
            //         headers: {
            //         Authorization: 'Bearer ' + localStorage.getItem("token")
            //         }
            //    })
                chatBody.removeChild(document.getElementById(this.props.allMessages.length))

               sendFile(response.data.secure_url+"img")

            } catch (error) {
                console.log(error.stack);
            }
        }
        const sendFile=async(filename)=>{
            try {
                if (this.props.allMessages.length>0) {
                    let message=await sendMessage(filename,this.props.currentChat.chat._id)
                    this.props.addMessage(message)
                    this.props.socket.emit('send-message',{
                        message,
                        sender:this.props.user,
                        chatId:this.props.currentChat.chat._id,
                        receiver:this.props.currentChat.with._id
                    })
                    this.setState({text:""})
                } else {
                    let chat=await createChat()
                    let message=await sendMessage(filename,chat)
                    let newC={
                        _id:chat,
                        last_message:message
                    }
                    let newChat={
                        "chat":newC,
                        with:this.props.user,
                        new_message:1
                    }
                    this.props.newChat(chat,message)
                    this.props.socket.emit('new-chat',{
                        message,
                        sender:this.props.user,
                        chat:newChat,
                        receiver:this.props.currentChat.with._id
                    })
                    this.setState({text:""})
                }
            } catch (error) {
                if(error.response){
                    console.log(error.response.data);
                }
                else{
                    console.log(error.stack);
                }
            }
        }
        const openPreview=(url)=>{
            this.setState({currentImage:url},()=>{
                var imgPreview=document.getElementById("image-preview")
                imgPreview.classList.toggle("show")
            })
        }
        const closePreview=()=>{
            var imgPreview=document.getElementById("image-preview")
            imgPreview.classList.toggle("show")
        }
        return(
            <div className="chat-box">
                <div className="chat-box-header">
                    <div className="profile">
                        <div className="whole-back" onClick={this.props.closeChat}>
                            <div className="back">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M 15,8 C 15,7.7238576 14.73683,7.048 14.460688,7.048 H 3.9846413 L 6.2274644,4.6488403 C 6.6994642,4.1768405 5.315084,2.9709058 4.8708157,3.4690958 L 1.146,7.646 c -0.19585838,0.1953639 -0.19585838,0.5126361 0,0.708 l 4,4 c 0.4719998,0.472 1.5338081,-0.747057 1.0618084,-1.219057 L 3.9649853,8.814744 14.480344,8.8144 C 14.756486,8.814391 15,8.2761424 15,8 Z"/>
                                </svg>
                            </div>
                            <div className="profile-pic">
                                <img src={"../assets/"+(this.props.currentChat.with.username.charAt(0)).toLowerCase()+".svg"} alt="user profile" ></img>
                            </div>
                        </div>
                        <div className="profile-name">{this.props.currentChat.with.username}</div>
                    </div>
                    <div className="menu">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                        </svg>
                    </div>
                </div>
                {this.state.currentDate?
                    <div className="message-date" id="message-date">
                        {!datesAreOnSameDay( 
                                new Date(this.state.currentDate),
                                new Date())?
                            months[(new Date(this.state.currentDate)).getMonth()] +" " +(new Date(this.state.currentDate)).getDate() + ( ((new Date(this.state.currentDate)).getFullYear() !== (new Date()).getFullYear()) ? (", "+(new Date(this.state.currentDate)).getFullYear() ): "" )
                            :"Today"
                        }
                    </div>
                    :null
                }
                <div className="chat-box-body" id="chat-body">
                    {this.props.allMessages.map((_,i)=>_.text.slice(_.text.length-3,_.text.length)==="img"?imageBox(_,i) :messageBox(_,i))}
                </div>
                {this.state.openEmoji?<div className="emoji-container"><Picker onEmojiClick={emojiClick} pickerStyle={{width:"350px"}} /></div>:null}
                <div className="chat-box-form">
                    <form onSubmit={handleSubmit}>
                        <input id="messagebar" className="text" data-emoji-input="unicode" type="text" value={this.state.text} onChange={(e)=>this.setState({text:e.target.value})} placeholder="Type a message"></input>
                        <label htmlFor="media-file"><i className="bi bi-paperclip"></i></label>
                        <input className="file" type="file" id="media-file" onChange={handleMedia} />
                        <i onClick={()=>{this.setState({openEmoji:!this.state.openEmoji})}} className="bi bi-emoji-smile emoji"></i>
                    </form>
                </div>
                <div className="image-preview" id="image-preview">
                    <div onClick={closePreview} className="close-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                            <path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z"/>
                        </svg>
                    </div>
                    <div className="image" onClick={closePreview}>
                        <img onClick={(e)=>e.stopPropagation()} src={this.state.currentImage} alt="loading..."/>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(value){
    return {users:value.message}
}

export default connect(mapStateToProps)(ChatBox);