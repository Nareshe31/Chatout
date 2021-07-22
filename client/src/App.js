import axios from 'axios';
import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import LoadingRing from './components/molecules/LoadingRing';
import './components/sidebar.css'
import { URL } from "./utils/allFunctions";

class App extends Component {

    async componentWillMount(){
        let token = localStorage.getItem('token')
        let user=JSON.parse(sessionStorage.getItem("user"))
        if (token && user && Object.keys(user).length>0) {
            let obj = {
                type: "LOGIN",
                payload: {
                    user
                }
            }
            this.props.dispatch(obj)
            this.props.dispatch({type:"LOADED"})
        }
        else if(token){
            let response=await axios.get(URL+"/api/user-details/"+token)
            let {user}=response.data
            sessionStorage.setItem("user",JSON.stringify(user))
            let obj = {
                type: "LOGIN",
                payload: {
                    user
                }
            }
            this.props.dispatch(obj)
            this.props.dispatch({type:"LOADED"})
        }
        else{
            this.props.dispatch({type:"LOADED"})
        }
    }
    render() {
        return (
            <Fragment>
            {this.props.loading?
                <div>
                    <Router>
                        <Switch>
                            <Route path="/dash" component={Dashboard} />
                            <Route path="/" component={Home} />
                            <Route path="*" render={()=><Redirect to="/" />} />
                        </Switch>
                    </Router>
                </div>
                :<div className="home-load">
                    <div>
                        <img src="./android-chrome-512x512.png" alt="App logo" className="logo"></img>
                    </div>
                    
                </div>
            }
            </Fragment>
        )
    }
}

function mapStateToProps(value) {
    return { user: value.user,loading:value.loading}
}

export default connect(mapStateToProps)(App)