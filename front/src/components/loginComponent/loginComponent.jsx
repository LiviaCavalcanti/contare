import React, { Component } from "react"
import { Form, Button } from "react-bootstrap"
import './loginComponent.css'
import { login } from '../../services/index'
import 'react-toastify/dist/ReactToastify.min.css';


class LoginScreen extends Component {
    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.state = {
            validated: false
        }
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

    render() {
        return (
            <div>
                <h3>Entrar</h3>
                <Form
                    noValidate
                    validated={this.state.validated}
                    onSubmit={e => this.handleSubmit(e)}>

                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control required={true} type="email" placeholder="Digite seu email" />
                        <Form.Control.Feedback type="invalid">
                            Por favor digite o email.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Senha</Form.Label>
                        <Form.Control required={true} type="password" placeholder="Digite sua senha" />
                        <Form.Control.Feedback type="invalid">
                            Por favor digite sua senha.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Entrar
                </Button>
                </Form>

            </div>
        )
    }
}

export default LoginScreen