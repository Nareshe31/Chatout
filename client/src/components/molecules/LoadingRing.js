import React, { Component } from 'react'

class LoadingRing extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div className="loading-screen" style={{height:`calc(100% - ${this.props.height}px`}}>
                <div className="ring"></div>
            </div>
        )
    }
}

export default LoadingRing;