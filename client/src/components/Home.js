import React from "react";
import { connect } from "react-redux";
import { NavLink, Redirect, Route } from "react-router-dom";
import Login from "./molecules/Login";
import Signup from "./molecules/Signup";

class Home extends React.Component {
    render() {
        if (this.props.user) return <Redirect to="/dash/chat" />
        else {
            return (
                <div className="home-div">
                    <div className="home-nav">
                        <div className="home-header mb-4">
                            <h3>Chatout</h3>
                        </div>
                        <div className="home-button">
                            <NavLink to="/login" activeClassName="active" className="nav-btn"><button >Login</button></NavLink>
                            <NavLink to="/signup" activeClassName="active" className="nav-btn"><button >Signup</button></NavLink>
                          
                        </div>
                    </div>
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/signup" component={Signup} />
                </div>
            )
        }
    }
}

function mapStateToProps(value) {
    return { user: value.user }
}

export default connect(mapStateToProps)(Home)