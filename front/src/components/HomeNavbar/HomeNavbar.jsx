import React, { Component } from "react";
import logo from "assets/img/contare_logo.png";
import './HomeNavbar.css'

class HomeNavbar extends Component {
    constructor(props) {
        super(props)

    }

    redirect = (path) => {
        this.props.history.push(path)
    }

    render(){
    return (
        <div class="homepage-lead-navbar">
        <div class="homepage-lead-navbar-content">
            <img src={logo} alt="logo_image" />
            <span ><a class="navbar-logo" href="/" onClick={() => this.redirect('/')}>CONTARE</a></span>
            <div class="homepage-lead-navbar-content-nav">
                <span ><a class="navbar-span" href="/register" onClick={() => this.redirect('/register')}>Registrar</a></span>
                <span ><a class="navbar-span" href="/login" onClick={() => this.redirect('/login')}>Login</a></span>
            </div>
        </div>
    </div>
    )}
}

export default HomeNavbar;