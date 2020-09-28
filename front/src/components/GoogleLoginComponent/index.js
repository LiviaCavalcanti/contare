import React, {Component} from 'react'
import '../registerComponent/registerComponent.css'
import {loginWithGoogle } from '../../services/userService'
import GoogleLogin from 'react-google-login'
import { GOOGLE_API_CREDENTIAL } from '../../services/index'

class GoogleLoginButton extends Component {

    handleGoogleLogin = (response) => {
        loginWithGoogle(response.tokenId)
    }

    render() {
        return (
            <GoogleLogin
            clientId={GOOGLE_API_CREDENTIAL}
            buttonText={this.props.buttonText}
            onSuccess={this.handleGoogleLogin}
            onFailure={this.handleGoogleLogin}
            cookiePolicy={'single_host_origin'}
            className="login-bt"
         />
        )
    }
    
}

export default GoogleLoginButton