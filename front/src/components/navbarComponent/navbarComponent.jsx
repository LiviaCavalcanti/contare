import React, { Component } from 'react';
import './navbarComponent.css';
import {Navbar, Button} from 'react-bootstrap'
import {NavLink} from 'react-router-dom'

class NavbarComponent extends Component {

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
                <Button > <NavLink to="/register" className="nav-button">Registrar-se</NavLink> </Button>
                <Button id="nav-button"> <NavLink to="/login" className="nav-button">Entrar</NavLink> </Button>
            </Navbar.Collapse>
          </Navbar>
         )
    }
}

export default NavbarComponent;
