import React, { Component } from "react"
import { Form, Button } from "react-bootstrap"
import '../registerComponent/registerComponent.css'
import { login } from '../../services/userService'
import 'react-toastify/dist/ReactToastify.min.css';
import { withRouter } from 'react-router';

class LoginScreen extends Component {
    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.state = {
            validated: false
        }
    }

    redirectToMain = () => {
        this.props.history.push("/")
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
            <div className="full-div">
                                <h1 onClick={() => this.redirectToMain()} className="logo">Contare</h1>
            <div className="board"></div>
            <div className="login-div" >
            <h1 className="login-title">FAÇA SEU LOGIN</h1>  
            <div className="form-div">
                <Form
                    noValidate
                    validated={this.state.validated}
                    onSubmit={e => this.handleSubmit(e)}>

                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control className="inputRegister"  required={true} type="email" placeholder="Digite seu email" />
                        <Form.Control.Feedback type="invalid">
                            Por favor digite o email.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Senha</Form.Label>
                        <Form.Control className="inputRegister"  required={true} type="password" placeholder="Digite sua senha" />
                        <Form.Control.Feedback type="invalid">
                            Por favor digite sua senha.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Button className="login-bt" variant="success" type="submit">
                        Entrar
                </Button>
                </Form>
                <a className="footer-text">Não possui cadastro? <a className="footer-text-click" href="/register">Registre-se</a></a>
                </div>
</div>
            </div>
        )
    }
}

export default withRouter(LoginScreen)