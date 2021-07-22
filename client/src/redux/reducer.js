import { combineReducers } from "redux"

let initialstate=[
    {
        name:"Sachin",
        messages:[{msg:"Hi",class:"left"},{msg:"Hello",class:"right"},{msg:"How are you ?",class:"left"}]
    },
    {
        name:"Naresh",
        messages:[{msg:"Oii",class:"left"},{msg:"Hello",class:"right"},{msg:"How are you ?",class:"left"},{msg:"Oii",class:"left"},{msg:"Hello",class:"right"},{msg:"How are you ?",class:"left"},{msg:"Oii",class:"left"},{msg:"Hello",class:"right"},{msg:"How are you ?",class:"left"},{msg:"Oii",class:"left"},{msg:"Hello",class:"right"},{msg:"How are you ?",class:"left"}]
    },
    {
        name:"Siva Prakash",
        messages:[{msg:"Hey man",class:"left"},{msg:"Hi",class:"right"},{msg:"How are you ?",class:"left"}]
    },
    {
        name:"Chebolu",
        messages:[{msg:"Hi",class:"left"},{msg:"Hello",class:"right"},{msg:"How are you ?",class:"left"}]
    }
]
function message(state=initialstate,action) {
    if(action.type==="ADD"){
        return state.map((_,i)=>{
            if(i===action.from){
                _.messages.push(action.message)
                return _
            }
            return _
        })
    }
    return state
}

function loading(state=false,action){
    if(action.type==="LOADED"){
        state=true
        return state
    }
    return state
}

function user(state=null,action) {
    if(action.type==="LOGIN"){
        state=action.payload.user
        return state
    }
    else if(action.type==="LOGOUT"){
        state=null
        return state
    }
    return state
}
let combine=combineReducers({user,message,loading})

export default combine;