import React from "react";
import axios from 'axios';
import { Redirect } from "react-router";
import { connect } from "react-redux";
// import GoogleLogin from 'react-google-login';
import { URL } from '../../utils/allFunctions';
import QrScanner from 'qr-scanner';
import { isMobile } from 'react-device-detect'

var qrScanner;
class Login extends React.Component {
    state = {
        form: {
            email: "",
            password: ""
        },
        successMessage: "",
        errorMessage: "",
        scan:false,
        scanError:""
    }

    handleChange = (e) => {
        let { name, value } = e.target
        let formDum = this.state.form
        formDum[name] = value
        this.setState({ form: formDum })
    }
    handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(URL+'/api/login', this.state.form)
            let obj = {
                type: "LOGIN",
                payload: {
                    user: response.data.user
                }
            }
            localStorage.setItem("token",response.data.token)
            sessionStorage.setItem("user",JSON.stringify(response.data.user))
            this.props.dispatch(obj)
            this.setState({ successMessage: response.data.message, errorMessage: "" })
        } catch (error) {
            console.log(error);
            if (error.response) {
                this.setState({ errorMessage: error.response.data.message, successMessage: "" })
            }
            else{
                this.setState({ errorMessage: error.message, successMessage: "" })
            }
        }
        
    }
    startScan=()=>{
        this.setState({scan:true},()=>{
            qrScanner = new QrScanner(document.getElementById('scan'), async(result) =>{
                if(result.substr(0,36)==="https://chat-out.herokuapp.com/qr?t="){
                    let token=result.substr(36,result.length)
                    let response=await axios.get(URL+"/api/user-details/"+token)
                    let {user}=response.data
                    if(user){
                        localStorage.setItem('token',token)
                        sessionStorage.setItem("user",JSON.stringify(user))
                        let obj = {
                            type: "LOGIN",
                            payload: {
                                user
                            }
                        }
                        this.props.dispatch(obj)
                        this.setState({scan:false})
                        qrScanner.stop()
                    }
                    else{
                        this.setState({scanError:"Wrong QR code"})
                    }
                }
                else{
                    this.setState({scanError:"Wrong QR code"})
                }
                
            });
            qrScanner.start()
        })
        
    }
    render() {
        return (
            <div className="login-div">
                <div className="login-heading">
                    <h4>Login</h4>
                </div>
                {!this.state.scan?
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="text" name="email" value={this.state.form.email} className="m-input" placeholder="Email address" onChange={this.handleChange}></input>
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" value={this.state.form.password} className="m-input" placeholder="Password" onChange={this.handleChange}></input>
                    </div>
                    <div className="form-group">
                        {this.state.successMessage ? <Redirect to="/dash" /> : null}
                        {this.state.errorMessage ? <div className="alert alert-danger">{this.state.errorMessage}</div> : null}
                    </div>
                    {/* <GoogleLogin
                        clientId="340167076203-ohtlbvocf2vc5qmeklecn0r20joe4i7v.apps.googleusercontent.com"
                        buttonText="Login"
                        onSuccess={responseGoogle}
                        onFailure={responseGoogle}
                        cookiePolicy={'single_host_origin'}
                    /> */}
                    {isMobile?
                        <div className="form-group">
                            <label style={{cursor:"pointer"}} onClick={this.startScan}>or scan QR code <i className="bi bi-upc-scan"></i></label>
                        </div>
                        :null
                    }
                    <div className="form-group">
                        <button type="submit" className="m-btn">Submit</button>
                    </div>
                </form>
                :null
                }
                {this.state.scan?
                    <div className="scanner">
                        <div className="scan-close" onClick={()=>{
                            qrScanner.stop()
                            this.setState({scan:false})
                            }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                                <path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z"/>
                            </svg>
                        </div>
                        <video id="scan"></video>
                    </div>
                    :null
                }
            </div>
        )
    }
}

function mapStateToProps(value) {
    return { user: value.user }
}


export default connect(mapStateToProps)(Login);
