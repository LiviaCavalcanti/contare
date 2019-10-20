import React, { Component } from 'react';
import './navbarComponent.css';
import {Navbar, Button} from 'react-bootstrap'
import {NavLink} from 'react-router-dom'
import {redirectLoggedUser, verifyUser} from '../../services/userService'

class NavbarComponent extends Component {

    constructor(props){
      super(props)
      this.userIsAuthenticated = this.userIsAuthenticated.bind(this)
      this.verifyLogin = this.verifyLogin.bind(this)
      this.logout = this.logout.bind(this)
      this.state = {
        authenticated: false
      }
    }

    userIsAuthenticated = () => {
      const token = localStorage.getItem("token-contare")
        redirectLoggedUser(token)
    }
    
    verifyLogin = () => {
      const token = localStorage.getItem("token-contare")
      if(token !== undefined || token != null) {
        verifyUser(token, function(response){
          this.setState({authenticated:true})
        }.bind(this))
  
      }
    }

    componentDidMount() {
      this.verifyLogin()
    }

    logout() {
      localStorage.removeItem("token-contare")
      window.location.href = "/"
    }

    render() {
        return (
            <Navbar bg="dark" variant="dark" expand="lg" id="navbar">
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
              <NavLink to="/" id="brand"> 
                          
            <Navbar.Brand href="#home">
              <img
                alt=""
                src="/logo.png"
                width="50"
                height="30"
                className="d-inline-block align-top"
              />
                </Navbar.Brand>
              Contare </NavLink>

            <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
        {!this.state.authenticated &&  <NavLink to="/register" className="nav-button"><Button>Registre-se</Button></NavLink> }
        {!this.state.authenticated && <NavLink to="/login" className="nav-button"><Button onClick={() => this.userIsAuthenticated()} id="nav-button">Entrar</Button></NavLink>}

        {this.state.authenticated &&  <NavLink to="/dashboard" className="nav-button"><Button variant="success">Minhas Finanças</Button></NavLink> }
        {this.state.authenticated && <Button variant="danger" onClick={() => this.logout()} id="nav-button">Sair</Button>}

            </Navbar.Collapse>
          </Navbar>
         )
    }
}

export default NavbarComponent;
