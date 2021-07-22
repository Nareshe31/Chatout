import React, { Component } from 'react'

class Loading extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div className="loading-screen" style={{height:`calc(100% - ${this.props.height}px`}}>
                <div className="">loading...</div>
            </div>
        )
    }
}

export default Loading;