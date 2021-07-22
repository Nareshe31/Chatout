import React from "react";
import axios from 'axios';
import { Redirect } from "react-router";
import { URL } from "../../utils/allFunctions";

class Signup extends React.Component {

    state = {
        form: {
            username:"",
            email: "",
            password: ""
        },
        successMessage: "",
        errorMessage: ""
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
            const response = await axios.post(URL+'/api/signup', this.state.form)
            this.setState({ successMessage: response.data.message, errorMessage: "" })
        } catch (error) {
            if (error.response) {
                this.setState({ errorMessage: error.response.data.message, successMessage: "" })
            }
            else{
                this.setState({ errorMessage: error.message, successMessage: "" })
            }
        }
    }

render() {
	return(
        <div className="login-div">
            <div className="login-heading">
                <h4>Signup</h4>
            </div>
            <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label>Username</label>
                    <input type="text" required name="username" value={this.state.form.username} onChange={this.handleChange} className="m-input" placeholder="Username"></input>
                </div>
                <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" required name="email" value={this.state.form.email} onChange={this.handleChange} className="m-input" placeholder="Email address"></input>
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" required name="password" value={this.state.form.password} onChange={this.handleChange} className="m-input" placeholder="Password"></input>
                </div>
                <div className="form-group">
                    {this.state.successMessage ? <Redirect to="/login" /> : null}
                    {this.state.errorMessage ? <div className="alert alert-danger">{this.state.errorMessage}</div> : null}
                </div>
                <div className="form-group">
                    <button className="m-btn">Submit</button>
                </div>
            </form>
        </div>
    )
}
}

export default Signup;
