import { Component } from "react";
import ChatBox from './molecules/ChatBox';
import { connect } from 'react-redux';
import axios from 'axios';
import { Fragment } from "react";
// import {isMobile} from 'react-device-detect'
import { URL,datesAreOnSameDay,getTime, getDate,messageLength,isImage,isUser,sortChats,getUsers } from '../utils/allFunctions';
import Loading from "./molecules/Loading";

class Chat extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentChat: {},
            allMessages: [],
            allUsers: [],
            allChats:[],
            search_name: '',
            searched_users: null,
            loading:false,
            searching:true
        }
    }

    async componentWillMount(){
        try {
            let res=await axios.get(URL+'/chat/all-chats/'+this.props.user._id,{
                headers: {
                  Authorization: 'Bearer ' + localStorage.getItem("token")
                }
               })
            let sortedChats=sortChats(res.data.chats)
            let allUsers=getUsers(sortedChats)
            this.setState({allChats:res.data.chats,allUsers,loading:true})
        } catch (error) {
            if(error.response){
                console.log(error.response.data.message);
            }
            else{
                console.log(error.message);
            }
        }
    }

    componentDidMount(){
        document.getElementById('searchbar').focus()
        this.props.socket.on('receive-message',async(data)=>{
            this.playSound()
            if (this.state.currentChat.chat && data.chatId===this.state.currentChat.chat._id) {
                let msgDum=this.statePush("allMessages",data.message)
                await axios.post(URL+'/chat/see-message',{
                    chatId:this.state.currentChat.chat._id,
                    sender:this.props.user._id
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem("token")
                    }
                })
                let allChatsDum=this.state.allChats
                allChatsDum[this.state.allUsers.indexOf(this.state.currentChat.with._id)].chat.last_message=data.message
                let sortedChats=sortChats(allChatsDum)
                let allUsers=getUsers(sortedChats)
                this.setState({allMessages:msgDum,allUsers,allChats:sortedChats,currentChat:sortedChats[allUsers.indexOf(this.state.currentChat.with._id)]})
            } else {
                let allChatsDum=this.state.allChats
                allChatsDum[this.state.allUsers.indexOf(data.sender._id)].chat.last_message=data.message
                allChatsDum[this.state.allUsers.indexOf(data.sender._id)].new_message=allChatsDum[this.state.allUsers.indexOf(data.sender._id)].new_message+1
                let sortedChats=sortChats(allChatsDum)
                let allUsers=getUsers(sortedChats)
                this.setState({allChats:sortedChats,allUsers})
            }
        })
        this.props.socket.on('new-chat',(data)=>{
            this.playSound()
            let allChatsDum=this.statePush("allChats",data.chat)
            let sortedChats=sortChats(allChatsDum)
            let allUsers=getUsers(sortedChats)
            this.setState({allChats:sortedChats,allUsers})
        })
    }
    playSound=()=>{
        let src="../whatsapp-notification-sound.mp3"
        let audio=new Audio(src)
        audio.play()
    }
    statePush=(state,value)=>{
        let dum=this.state[state]
        dum.push(value)
        return dum
    }
    render() {
        let timer;
        const searchUser = async (name=this.state.search_name) => {
            window.clearTimeout(timer)
            timer=window.setTimeout(async()=>{
                try {
                    if (name !== '') {
                        this.setState({searching:true})
                        let response = await axios.get(URL+'/api/search/' + name)
                        this.setState({ searched_users: response.data.users,searching:false})
                    }
                    else {
                        this.setState({ searched_users: null, search_name: "" })
                    }
    
                } catch (error) {
                    console.log(error.response.data.message);
                }
            },250)
            
        }
        function handleKeyPress(e) {
            window.clearTimeout(timer);
        }
        const chatChanged=async(chat)=>{
            try {
                let allChatsDum=this.state.allChats
                let response=await axios.get(URL+'/chat/all-messages/'+chat.chat._id,{
                    headers: {
                      Authorization: 'Bearer ' + localStorage.getItem("token")
                    }
                   })
                if(chat.new_message!==0){
                    await axios.post(URL+'/chat/see-message',{
                        chatId:chat.chat._id,
                        sender:this.props.user._id
                    },{
                        headers: {
                          Authorization: 'Bearer ' + localStorage.getItem("token")
                        }
                       })
                    allChatsDum[this.state.allUsers.indexOf(chat.with._id)].new_message=0
                    chat.new_message=0
                }
                this.setState({allChats:allChatsDum,currentChat:chat,allMessages:response.data.messages})
            } catch (error) {
                console.log("Error occurred",error.message || error.stack);
            }
        }
        const addMessage=(message)=>{
            let msgDum=this.statePush("allMessages",message)
            let allChatsDum=this.state.allChats
            allChatsDum[this.state.allUsers.indexOf(this.state.currentChat.with._id)].chat.last_message=message
            let sortedChats=sortChats(allChatsDum)
            let allUsers=getUsers(sortedChats)
            this.setState({allMessages:msgDum,allChats:sortedChats,allUsers,currentChat:sortedChats[allUsers.indexOf(this.state.currentChat.with._id)]})
        }
        const newChat=(chat,message)=>{
            let msgDum=this.statePush("allMessages",message)
            let allChatsDum=this.state.allChats
            allChatsDum[this.state.allUsers.indexOf(this.state.currentChat.with._id)].chat={_id:chat,"last_message":message}
            let sortedChats=sortChats(allChatsDum)
            let allUsers=getUsers(sortedChats)
            this.setState({allMessages:msgDum,allChats:sortedChats,currentChat:sortedChats[allUsers.indexOf(this.state.currentChat.with._id)]})
        }
        const searchUserClicked=(_)=>{
            if(this.state.allUsers.includes(_._id)){
                chatChanged(this.state.allChats[this.state.allUsers.indexOf(_._id)])
                this.setState({search_name:""})
            }
            else{
                let newChat={
                    chat:{
                        _id:"6392340902348234"
                    },
                    with:_,
                    last_message:{
                        text:"",
                        sender:_._id,
                        sent_At: (new Date())
                    }
                }
                let allChatsDum=this.statePush("allChats",newChat)
                this.setState({allChats:allChatsDum,search_name:"",currentChat:newChat,allUsers:getUsers(allChatsDum)})
            }
        }
        
        return (
            <div className="d-flex chat-parent">
                <div className="chat-top-level">
                    <div className="chat-participants">
                        <div className="chat-participants-header">
                            <div className="search-user">
                                <input id="searchbar" value={this.state.search_name} onKeyUp={()=>searchUser()} onKeyPress={handleKeyPress} onChange={(e) =>this.setState({search_name:e.target.value})} type="text" placeholder="Search" />
                                {this.state.search_name !== '' ?
                                    <div className="search-close">
                                        <i className="bi bi-x" onClick={() => this.setState({searched_users:null,search_name: "",searching:true })}></i>
                                    </div>
                                    : null
                                }
                            </div>

                        </div>

                        {this.state.search_name === '' ?
                            <Fragment>
                                {this.state.loading?
                                <Fragment>
                                    {this.state.allChats && this.state.allChats.length>0?
                                        <div className="chat-participants-body">
                                            {this.state.allChats.map((_, i) =>
                                                <div key={i} id={"participant"+i} className={this.state.currentChat?.chat?._id && this.state.currentChat.chat._id === _.chat._id ? "current-user name" : "name"} onClick={(e)=>{
                                                    if(_.chat._id!==this.state.currentChat?.chat?._id) chatChanged(_)
                                                    else{
                                                        var participantDiv=document.getElementById("participant"+i)
                                                        if(participantDiv.classList.contains("expand")){
                                                            participantDiv.classList.remove("expand")
                                                            setTimeout(()=>{
                                                                participantDiv.classList.add("expand")
                                                            },10)
                                                        }
                                                        else{
                                                            participantDiv.classList.add("expand")
                                                        }
                                                    }
                                                    }} >
                                                    <div className="profile-pic">
                                                        <img src={"../assets/"+(_.with.username.charAt(0)).toLowerCase()+".svg"} alt="Profile picture"></img>
                                                    </div>
                                                    <div className="profile-name">
                                                        <div className={_.chat?.last_message?.text?"row1":"row row1"}>
                                                            <p className="username">{_.with.username}</p>
                                                            {_.new_message?<p className="notification"><span>{_.new_message}</span></p>:null}
                                                        </div>
                                                        
                                                        {_.chat?.last_message?.text?
                                                            <div className="row2">
                                                                <p className="last-message">{isImage(_.chat.last_message.text)?
                                                                <span>
                                                                    <i className="bi bi-image"></i><span style={{marginLeft:"5px"}}>Photo</span>
                                                                </span>
                                                                :messageLength(_.chat.last_message.text,28)}</p>
                                                                <p className="last-message-time">{(datesAreOnSameDay(new Date(_.chat.last_message.sent_At),(new Date())))?getTime(_.chat.last_message.sent_At):getDate(_.chat.last_message.sent_At)}</p>
                                                            </div>
                                                        :null
                                                        }
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        :
                                        <div className="no-users">
                                            <div style={{textAlign:"center"}}>No chats available😥 
                                                <p style={{fontSize:"1rem"}}>(Search any existing user and start chatting)</p>
                                            </div>
                                        </div>
                                    }
                                </Fragment>
                                :
                                <Loading height="55"></Loading>
                                }
                            
                            </Fragment>
                            :
                            <Fragment>
                                {this.state.searching?
                                <div className="no-users">searching...</div>
                                :
                                (this.state.searched_users && this.state.searched_users.length===1 && this.state.searched_users[0]._id!==this.props.user._id ) || (this.state.searched_users && this.state.searched_users.length > 1)?
                                <div className="chat-participants-body">
                                    {this.state.searched_users.map(_ =>
                                        _._id!==this.props.user._id?
                                            <div className="name" onClick={()=>{searchUserClicked(_)}} key={_._id}>
                                                <div className="profile-pic">
                                                    <img src={"../assets/"+(_.username.charAt(0)).toLowerCase()+".svg"} alt="Profile picture"></img>
                                                </div>
                                                <div className="search-profile-name">
                                                    <p className="search-username">{_.username}</p>
                                                </div>
                                            </div>
                                        :null
                                    )}
                                </div>
                                :
                                <div className="no-users">No results😥</div>
                                }
                            </Fragment>
                            
                        }

                    </div>
                    {Object.keys(this.state.currentChat).length>0?
                        <ChatBox key={this.state.currentChat} newChat={newChat} addMessage={addMessage} currentChat={this.state.currentChat} allMessages={this.state.allMessages} socket={this.props.socket} user={this.props.user} />
                        :
                        <div className="before-chat">
                            <h5>Select a chat to start messaging</h5>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

function mapStateToProps(value) {
    return { users: value.message ,user:value.user}
}

export default connect(mapStateToProps)(Chat);