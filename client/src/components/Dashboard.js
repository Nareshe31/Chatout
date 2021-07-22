import { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import Chat from './Chat';
import SideBar from './SideBar';
import Video from './Video';
import { io } from 'socket.io-client';
import { isMobile } from 'react-device-detect'
import MobileChat from './MobileChat';
import { URL } from "../utils/allFunctions";
import QRCode from 'qrcode'

var socket;

class Dashboard extends Component {

    componentWillMount() {
        if (this.props.user) {
            socket = io(URL)
            socket.on('connect', () => {
                socket.once().emit('join', { room: this.props.user._id })
            })
        }
    }
    render() {
        if (!this.props.user) return <Redirect to='/' />
        else {
            return (
                <div className={isMobile?'d-flex dash mobile':'d-flex dash'}>
                    <SideBar url={this.props.location.pathname} />
                    <Switch>
                        <Route exact path={this.props.match.path + "/chat"} render={() => isMobile ? <MobileChat socket={socket} /> : <Chat socket={socket} />} />
                        <Route exact path={this.props.match.path + "/call"} render={()=>{
                            return(
                                <div className="dash-dashboard">
                                    <h4>Coming Soon...</h4>
                                </div>
                            )
                        }} />
                        <Route exact path={this.props.match.path + "/video"} render={()=>{
                            return(
                                <div className="dash-dashboard">
                                    <h4>Coming Soon...</h4>
                                </div>
                            )
                        }} />
                        <Route exact path={this.props.match.path + "/dashboard"} render={() => {
                            const logOut = () => {
                                localStorage.clear()
                                sessionStorage.clear()
                                this.props.dispatch({ type: "LOGOUT" })
                            }
                            const generateQR = async () => {
                                try {
                                    let url = await QRCode.toDataURL("https://chat-out.herokuapp.com/qr?t="+localStorage.getItem('token'), { errorCorrectionLevel: 'H' })
                                    document.getElementById('qr').src = url
                                } catch (err) {
                                    console.error(err)
                                }
                            }
                            setTimeout(() => {
                                generateQR()
                            }, 100);
                            return (
                                <div className="dash-dashboard">
                                    <div className="welcome-div">
                                        <h4>Welcome {this.props.user.username}😊</h4>
                                        <img src="https://res.cloudinary.com/dkmxj6hie/image/upload/v1625645421/qr_anmyfl.png" style={{ marginTop: "0.5rem" }} id="qr" width="200" height="200" alt="QR Code"></img>
                                        <h5>Scan QR code to login</h5>
                                        <button onClick={logOut} className="m-btn">Logout</button>
                                        {/* <img width="250" height="250" src={URL+"/ee873fa3bfc42b3952f99e927c4e2330"}/> 
                                        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAEpElEQVR4Xu2d244iMQxE4f8/mpX2rcOIo5KdAObMq3Oxq1x20jTM/fF4PG7+jUHgLqFjuPwfiITO4lNCh/EpoRI6DYFh8dhDJXQYAsPCUaESOgyBYeGoUAkdhsCwcFSohA5DYFg4KlRChyEwLJyyQu/3+1FI1o9v0/1pPtl3B1v9eFpCl4SUUBXaKloVGiYUKZDsrez9sdjHEVp1aI1x7ZG0fjqeCOperxof+lt9p+jTAu72p3s9CYVDy3aAwv1JQdv9VaGvKVChy2u+774n0iGn2pN3xxcrfrdCdwdM60tomBJUkgjwdbuUAFo/XS/tcbR/Nb6QjvprnBKaPfqsJhgR3P7ojxwmh2g+9byqwtL9VSgwmgJKCZJWkHR/CZXQCwKUcJSwTxXp20+5FDAB1m0nf9IKQOuNI5QISXtqOt6S21xyJfQK6NefciVUQi8I0DWIEubnSm7a1NMeRuunhOw+tHTHd/xQRICTnQipzqf1yU77k717/e09lAIiezVgml+1k/9kp/1pvgqFj/csueFLWmnGreNTwEkBqb3qP82nQxrNby+5tGHVLqGvEZRQX7ReLrKW3GrRie7FtFlZobTBbnv1Yr/bv9PrS+hpxDfvJ6GbAT69vISeRnzzfh9HKPVEuqdV75XvvhZRfJQPErogJKGUMqFdhdZ+YFyFqtBMcqQ4Wo16StozaT3y5+nTDXiw0r0f+bddoRJaK6FE4FOCVV/jpA0lVEKjZ5uW3OXZ+mmFpj2FCNvd06jCdF9zqOKR/XgPldDrt9VSPCQUriUIUHiKpYpCdvKH7CoUELLkUgot9mrGEuCrO9WeF4b3NLy7xB6/thAAEkoIZfbtJZfckVBCKLNL6OGXxD6+5FIP292zUoBSf0kf3evRfmQvKzQNiEosrUeHHAw4vIacXo/2I7uEHr6nEiFVu4RKaDWHeuenJbzac6tngnR+ilZZoemG3eMl9IqohIaP/lKF7U64j3tSVFXsbsCq61fnp/iUFZpeM1IHq9eUpwwOf6GaCKH1Kd60p9N6Erp8o5sIIgLSBKf1iMD2kpsGkDqoQjPEVKgKXY7JYU/K8u12ox5WrRDpqZX8T/35+JLb7uDmT0MkdElRUhBlNNlp/VQR1JNpv9RfGt8ugOprnFUAKGBaX0KbnxR1A14tgeRP9VpSnZ/6Rwm//dpChJCDNJ9KVApYOl5Cw5+9kVBK+df29nsoEULu0nwVKqEXBKjE0iGLEi5NWBqf2n9OoRIKKVIFqPtemPqTKi4dT/GlCqTxKjT895gSeviUS9eKbsVQzyVFtfuz+0lRGjApgE65EpoiFD7LldBMo0U6vv//hxJclFBlAMOWQv6W/dldcikAstOp9d0lllpEd49EvCSUILraKcF2VwTydvu1hRwgOwGoQpeEU6GUUj+u0AyefHR6aKASmHvwegb5l1ac1L/2kps6kI4nwNISnO5P48k/CV0QJMAkNEUIHixQBlftqbuW3Crizn8rAuUe+lbv3fwJAQkdlhQSKqHDEBgWjgqV0GEIDAtHhUroMASGhaNCJXQYAsPCUaESOgyBYeGoUAkdhsCwcFToMEL/ATByGw4Yc3/cAAAAAElFTkSuQmCC
                                        */}
                                    </div>
                                </div>
                            )
                        }} />
                        <Route path="*" render={() => <Redirect to="/dash/dashboard" />} />
                    </Switch>
                </div>
            )
        }
    }
}

function mapStateToProps(value) {
    return { user: value.user }
}

export default connect(mapStateToProps)(Dashboard)