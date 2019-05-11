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
                <NavLink to="/register" className="nav-button"><Button>Registre-se</Button></NavLink>
                <NavLink to="/login" className="nav-button"><Button id="nav-button">Entrar</Button></NavLink> 
            </Navbar.Collapse>
          </Navbar>
         )
    }
}

export default NavbarComponent;
