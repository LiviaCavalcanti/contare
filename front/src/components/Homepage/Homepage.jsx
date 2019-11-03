import React from 'react'
import {redirectLoggedUser} from '../../services/userService'
import {withRouter} from 'react-router'
import {Navbar, NavItem, Nav, Clearfix, Jumbotron, Button} from "react-bootstrap"
import './Homepage.css'

function Homepage(props) {
    if (localStorage.getItem('token-contare'))
        redirectLoggedUser(localStorage.getItem('token-contare'))

    function redirect(e, path) {
        e.preventDefault()
        props.history.push(path)
    }

    return (
        <div className="homepage-div homepage-bg">
            <Navbar inverse>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="/" onClick={e => redirect(e, '/')}>Contare</a>
                    </Navbar.Brand>
                </Navbar.Header>
                <Clearfix visibleMdBlock visibleLgBlock>
                    <Nav pullRight>
                        <NavItem eventKey={1} href="/register" onClick={e => redirect(e, '/register')}>
                            Registrar
                        </NavItem>
                        <NavItem eventKey={2} href="/login" onClick={e => redirect(e, '/login')}>
                            Logar
                        </NavItem>
                    </Nav>
                </Clearfix>
                <Clearfix visibleXsBlock visibleSmBlock>
                    <Nav>
                        <NavItem eventKey={1} href="/register" onClick={e => redirect(e, '/register')}>
                            Registrar
                        </NavItem>
                        <NavItem eventKey={2} href="/login" onClick={e => redirect(e, '/login')}>
                            Logar
                        </NavItem>
                    </Nav>
                </Clearfix>
            </Navbar>
            <div className="homepage-presentation">
                <h1>Sobre o Contare</h1>
                <hr />
                <h4>
                    Contare é um web site de uso gratuito construido com intuito de ajudar as pessoas a controlar seus gastos.
                     Aqui, você pode manusear todas suas despesas, podendo compartilha-las com outros usuários.
                     Nosso maior objetivo é manter você sempre alerta de quanto está gastando mediante quanto você recebe,
                     e para isso, diversos alertas e mensagens personalizadas irão surgir para melhor orientá-lo.
                </h4>
            </div>
        </div>
    )
}

export default withRouter(Homepage)
