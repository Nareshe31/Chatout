// export const URL=""
export const URL="http://192.168.29.62:5000"
export const getTime=(time)=>{
    return (new Date(time)).toLocaleTimeString(navigator.language, {
        hour: '2-digit',
        minute:'2-digit'
      })
}

export const months=["January","February","March","April","May","June","July","August","September","October","November","December"]

export const datesAreOnSameDay = (first, second) =>{
    return (first.getFullYear() === second.getFullYear() &&
        first.getMonth() === second.getMonth() &&
        first.getDate() === second.getDate())
}

export const isUser=(userId,_id)=>{
    return userId===_id
}

export const getDate=(time)=>{
    var todayTime =new Date(time)
    var month = todayTime.getMonth() + 1;
    var day = todayTime.getDate();
    var year = todayTime.getFullYear();
    return day + "/" + month + "/" + year;
    // return (new Date(time)).toLocaleDateString()
}

export const messageLength=(text,size)=>{
    return text.length<size ? text : text.slice(0,size-1)+"..."
}

export const isImage=(text)=>{
    return text.slice(text.length-3,text.length)==="img"
}

export const getUsers=(chats)=>{
    return chats.map(_=>_.with._id)
}

export const sortChats=(chats)=>{
    return chats.sort((a,b)=>{
        return (new Date(b.chat.last_message.sent_At))-(new Date(a.chat.last_message.sent_At))
    })
}