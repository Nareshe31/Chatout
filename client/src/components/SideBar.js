import { Component } from 'react';
import { NavLink } from 'react-router-dom';

class SideBar extends Component {
    render() {
        return (
            <div className="side-bar">
                <div className="side-bar-icons-first">
                    <NavLink to="/dash/dashboard" activeClassName="active-nav">
                        <div className="icons notification">
                            <i className={this.props.url==="/dash/dashboard"?"bi bi-house-fill":"bi bi-house"} ></i>
                        </div>
                    </NavLink>
                    <NavLink to='/dash/call' activeClassName="active-nav">
                        <div className="icons call" >
                            <i className={this.props.url==="/dash/call"?"bi bi-telephone-fill":"bi bi-telephone"}></i>
                        </div>
                    </NavLink>
                    <NavLink to="/dash/video" activeClassName="active-nav" >
                        <div className="icons video">
                            <i className={this.props.url==="/dash/video"?"bi bi-camera-video-fill":"bi bi-camera-video"}></i>
                        </div>
                    </NavLink>
                    <NavLink to="/dash/chat" activeClassName="active-nav">
                        <div className="icons chat">
                            <i className={this.props.url==="/dash/chat"?"bi bi-chat-fill":"bi bi-chat"}></i>
                        </div>
                    </NavLink>

                </div>
                <div className="side-bar-icons-last">
                    <div className="icons setting">
                        <i className="bi bi-gear"></i>
                    </div>
                </div>
            </div>
        )
    }
}

export default SideBar