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
      <div class="homepage-container">

        <div class="homepage-lead">
          <div class="homepage-lead-navbar">
            <div class="homepage-lead-navbar-content">
              <span><a href="/" onClick={e => redirect(e, '/')}>Contare</a></span>
              <div class="homepage-lead-navbar-content-nav">
                <span><a href="/register" onClick={e => redirect(e, '/register')}>Registrar</a></span>
                <span><a href="/login" onClick={e => redirect(e, '/login')}>Login</a></span>
              </div>
            </div>
          </div>
          <div class="homepage-lead-content">
            <div class="homepage-lead-content-centered">
              <h1>Welcome to the best app ever made, <br /> Contare is an application that gives you the control</h1>
              <hr />
              <h3>Here, you organize your money like a pro, give it a try</h3>
                <a href="/register" onClick={e => redirect(e, '/register')}><h3>Register now</h3></a>
            </div>
          </div>
        </div>
    
        <div class="homepage-secondary">
          <div class="homepage-secondary-title">
            <h1>Some of our greatest features</h1>
            <hr />
          </div>
          <div class="homepage-secondary-box">
            <h2>Here, you organize your money like a pro, give it a try</h2>
            <h3>Welcome to the best app ever made, <br /> Contare is an application that gives you the control</h3>
          </div>
          <div class="homepage-secondary-box">
            <h2>Here, you organize your money like a pro, give it a try</h2>
            <h3>Welcome to the best app ever made, <br /> Contare is an application that gives you the control</h3>
          </div>
          <div class="homepage-secondary-box">
            <h2>Here, you organize your money like a pro, give it a try</h2>
            <h3>Welcome to the best app ever made, <br /> Contare is an application that gives you the control</h3>
          </div>
        </div>
    
        <div class="homepage-footer">
          <h6>All rights reserved. Team Contare 2019.</h6>
        </div>
    
      </div>
    )
}

export default withRouter(Homepage)
