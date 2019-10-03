import React, { Component } from "react"
import { Form, Button, Col, Container } from "react-bootstrap"
import './registerComponent.css'
import { registerUser } from '../../services/userService'
import {notifyFailure} from '../../services/notifyService'
import 'react-toastify/dist/ReactToastify.min.css';
import { withRouter } from 'react-router';


class RegisterScreen extends Component {
    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.state = {
            validated: false
        }
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
            <div className="board"></div>
                <div className="login-div" >
                
             <h1 className="login-title">REGISTRE-SE</h1>  
             <div className="form-div">
                <Form
                    noValidate
                    validated={this.state.validated}
                    onSubmit={e => this.handleSubmit(e)}>
                    <Form.Group controlId="formBasicName">
                        <Form.Label>Insira seu nome</Form.Label>

                        <Form.Control  className="inputRegister" required={true} type="text" placeholder="Insira seu nome" />
                        <Form.Control.Feedback type="invalid">
                            Por favor digite seu nome.
                        </Form.Control.Feedback>

                    </Form.Group>

                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Insira seu e-mail</Form.Label>
                        <Form.Control className="inputRegister" required={true} type="email" placeholder="Insira um e-mail válido" />
                        <Form.Control.Feedback type="invalid">
                            Por favor digite um email válido.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Insira sua senha</Form.Label>
                        <Form.Control className="inputRegister" required={true} type="password" placeholder="Escolha uma senha" />
                        <Form.Control.Feedback type="invalid">
                            Por favor digite sua senha.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formBasicPasswordConfirm">
                        <Form.Label>Confirme sua senha</Form.Label>
                        <Form.Control className="inputRegister" required={true} type="password" placeholder="Confirme sua senha escolhida" />
                        <Form.Control.Feedback type="invalid">
                            Por favor confirme sua senha.
                        </Form.Control.Feedback>

                    </Form.Group>
                    <Button className="login-bt" variant="success" type="submit" >
                        Cadastrar
                </Button>
                </Form>
                </div>
                
                

                </div>
                </div>
                
        )
    }
}

export default withRouter(RegisterScreen)