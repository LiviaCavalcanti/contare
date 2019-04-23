import React, {Component} from "react"
import {Form, Button} from "react-bootstrap"
import './registerComponent.css'
import { registerUser, notifyFailure } from '../../services/index'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css'; 


class RegisterScreen extends Component {
    constructor(props){
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
    }


    handleSubmit(event) {
        const name = event.currentTarget.elements[0].value
        const email = event.currentTarget.elements[1].value
        const pass = event.currentTarget.elements[2].value
        const confirmPass = event.currentTarget.elements[3].value

        if(pass !== confirmPass) {
            notifyFailure("Senhas não conferem!")
            event.preventDefault()
        } else {
            registerUser(name, email, pass)
            event.preventDefault()
        }
    }

    render(){
        return(
            <div>
                <h1>Registre-se</h1>
            <Form onSubmit={e => this.handleSubmit(e)}>
            <Form.Group controlId="formBasicName">
                    <Form.Label>Insira seu nome</Form.Label>
                    <Form.Control required={true} type="text" placeholder="Insira seu nome" />

                </Form.Group>

                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Insira seu e-mail</Form.Label>
                    <Form.Control required={true} type="email" placeholder="Insira um e-mail válido" />

                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Insira sua senha</Form.Label>
                    <Form.Control required={true} type="password" placeholder="Escolha uma senha" />
                </Form.Group>

                <Form.Group controlId="formBasicPasswordConfirm">
                    <Form.Label>Confirme sua senha</Form.Label>
                    <Form.Control required={true} type="password" placeholder="Confirme sua senha escolhida" />
                </Form.Group>
     
                <Button variant="primary" type="submit">
                    Cadastrar
                </Button>
            </Form>

            <ToastContainer />
            </div>
        )
    }
}

export default RegisterScreen