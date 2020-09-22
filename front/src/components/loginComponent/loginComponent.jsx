import React, { Component } from "react"
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap"
import '../registerComponent/registerComponent.css'
import { login, loginWithGoogle } from '../../services/userService'
import 'react-toastify/dist/ReactToastify.min.css';
import { withRouter } from 'react-router';
import HomeNavbar from '../HomeNavbar/HomeNavbar'
import GoogleLogin from 'react-google-login'
import { GOOGLE_API_CREDENTIAL } from '../../services/index'

class LoginScreen extends Component {
    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.state = {
            validated: false,
        }
    }
    redirect = (path) => {
        this.props.history.push(path)
    }

    handleSubmit(event) {
        const form = event.currentTarget;

        const email = event.currentTarget.elements[0].value
        const password = event.currentTarget.elements[1].value
        event.preventDefault()
        if (form.checkValidity()) {
            login(email, password);
        } else {
            this.setState({ validated: true });
        }
    }

    handleGoogleLogin = (response) => {
        console.log (response.tokenId)
        loginWithGoogle(response.tokenId)
    }

    render() {
        return (
            <div className="full-div">
                <HomeNavbar/>
            <div className="board"></div>
            <div className="login-div" >
            <h1 className="login-title">LOGIN</h1>  
            <div className="form-div">
                <form
                    onSubmit={e => this.handleSubmit(e)}>

                    <FormGroup controlId="formBasicEmail">
                        <ControlLabel>Email</ControlLabel>
                        <FormControl className="inputRegister"  required={true} type="email" placeholder="Digite seu email" />
                        <FormControl.Feedback type="invalid">
        
                        </FormControl.Feedback>
                    </FormGroup>

                    <FormGroup controlId="formBasicPassword">
                        <ControlLabel>Senha</ControlLabel>
                        <FormControl className="inputRegister"  required={true} type="password" placeholder="Digite sua senha" />
                        <FormControl.Feedback type="invalid">
                        </FormControl.Feedback>
                    </FormGroup>

                    <Button className="login-bt" variant="success" type="submit">
                        Entrar
                    </Button>
                    <GoogleLogin
                        clientId={GOOGLE_API_CREDENTIAL}
                        buttonText="Entre com o Google"
                        onSuccess={this.handleGoogleLogin}
                        onFailure={this.handleGoogleLogin}
                        cookiePolicy={'single_host_origin'}
                     />
                </form>
                <a className="footer-text">Não possui cadastro? <a className="footer-text-click" onClick={() => this.redirect("/register")}>Registre-se</a></a>
                </div>
</div>
            </div>
        )
    }
}

export default withRouter(LoginScreen)