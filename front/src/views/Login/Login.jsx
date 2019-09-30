import React, { Component } from "react"
import { Form, Button } from "react-bootstrap";

import './Login.css'
import { login } from '../../services/userService'
import 'react-toastify/dist/ReactToastify.min.css';

import {FormInputs} from "components/FormInputs/FormInputs";

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

                <FormInputs
                      ncols={["col-md-5"]}
                      properties={[
                        {
                          label: "Endereço de Email",
                          type: "email",
                          bsClass: "form-control",
                          placeholder: "Email"
                        }
                      ]}
                    />

                    <FormInputs
                      ncols={["col-md-5"]}
                      properties={[
                        {
                        label: "Senha",
                        type: "password",
                        bsClass: "form-control",
                        placeholder: "Senha"
                        }
                      ]}
                    />
                    <Button variant="primary" type="submit">
                        Entrar
                </Button>
                </Form>
            </div>
        )
    }
}

export default LoginScreen