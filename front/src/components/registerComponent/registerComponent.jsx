import React, { Component } from "react"
import { FormGroup, Button, ControlLabel, FormControl } from "react-bootstrap"
import './registerComponent.css'
import { registerUser } from '../../services/userService'
import {notifyFailure} from '../../services/notifyService'
import 'react-toastify/dist/ReactToastify.min.css';
import { withRouter } from 'react-router';
import HomeNavbar from '../HomeNavbar/HomeNavbar'
import GoogleLoginButton from '../GoogleLoginComponent/index'

class RegisterScreen extends Component {
    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.state = {
            validated: false
        }
    }

    redirect = (path) => {
        this.props.history.push(path)
    }


    handleSubmit(event) {
        const form = event.currentTarget;

        const name = event.currentTarget.elements[0].value
        const email = event.currentTarget.elements[1].value
        const pass = event.currentTarget.elements[2].value
        const confirmPass = event.currentTarget.elements[3].value


        event.preventDefault()
        if (form.checkValidity()) {
            if (pass !== confirmPass) {
                notifyFailure("Senhas não conferem!")
            } else {
                if(pass.length < 5) {
                    notifyFailure("Sua senha deve ter ao menos 5 caracteres!")
                } else {

                    if(name.trim() === ""){
                        notifyFailure("Nome inválido")
                    } else {
                        registerUser(name, email, pass, function(){
                            this.props.history.push("/login")
                        }.bind(this))
                    }
                }


            }
        } else {
            this.setState({ validated: true });
        }   
    }

    render() {
        return (
         <div className="full-div">
             <HomeNavbar/>
            <div className="board"></div>
                <div className="login-div" >
             <h1 className="login-title">Faça sua conta</h1>  
             <div className="form-div">
                <form onSubmit={e => this.handleSubmit(e)}>
                    <FormGroup controlId="formBasicName">
                       <ControlLabel>Insira seu nome</ControlLabel>

                        <FormControl  className="inputRegister" required={true} type="text" placeholder="Insira seu nome" />
                        <FormControl.Feedback type="invalid"/>
                    </FormGroup>

                    <FormGroup controlId="formBasicEmail">
                       <ControlLabel>Insira seu e-mail</ControlLabel>
                        <FormControl className="inputRegister" required={true} type="email" placeholder="Insira um e-mail válido" />
                        <FormControl.Feedback type="invalid"/>
                    </FormGroup>

                    <FormGroup controlId="formBasicPassword">
                       <ControlLabel>Insira sua senha</ControlLabel>
                        <FormControl className="inputRegister" required={true} type="password" placeholder="Escolha uma senha" />
                        <FormControl.Feedback type="invalid"/>
                    </FormGroup>

                    <FormGroup controlId="formBasicPasswordConfirm">
                       <ControlLabel>Confirme sua senha</ControlLabel>
                        <FormControl className="inputRegister" required={true} type="password" placeholder="Confirme sua senha escolhida" />
                        <FormControl.Feedback type="invalid"/>
                    </FormGroup>

                    <Button className="login-bt" bsStyle="success" type="submit" >
                        Registre-se
                    </Button>
                    <GoogleLoginButton buttonText="Registre-se com o Google"/>
                </form>
                <a className="footer-text">Já possui cadastro? <a className="footer-text-click" onClick={() => this.redirect("/login")}>Faça login</a></a>

                </div>
            </div>
        </div>        
        )
    }
}

export default withRouter(RegisterScreen)