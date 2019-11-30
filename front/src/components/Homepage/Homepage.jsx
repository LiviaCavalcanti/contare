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
              <h1>Bem-vindo(a) ao Contare! <br /> Uma aplicação que melhora sua organização financeira.</h1>
              <hr />
              <h3>Aqui, você consegue organizar seu dinheiro como nunca!</h3>
                <a href="/register" onClick={e => redirect(e, '/register')}><h3>Cadastre-se agora</h3></a>
            </div>
          </div>
        </div>
    
        <div class="homepage-secondary">
          <div class="homepage-secondary-title">
            <h1>Algumas de nossas funcionalidades</h1>
            <hr />
          </div>
          <div class="homepage-secondary-box">
            <h2>Gráficos Intuitivos</h2>
            <h3>Visualize graficamente quanto você gasta por categorias personalizadas, como Comida, Viagem, Alguel etc. Selecione períodos para visualizar seu histórico de rendas e gastos ao longo do tempo.</h3>
          </div>
          <div class="homepage-secondary-box">
            <h2>Compartilhe gastos</h2>
            <h3>Aqui, você pode adicionar amigos e dividir despesas em comum facilmente. Os cálculos de quanto cada um deve é feito automaticamente de acordo com os critérios escolhidos.</h3>
          </div>
          <div class="homepage-secondary-box">
            <h2>Exporte seus dados financeiros para PDF</h2>
            <h3>Você também tem a opção de gerar um relatório detalhado para o formato PDF de forma a poder imprimir e visualizá-lo onde quiser.</h3>
          </div>
        </div>
    
        <div class="homepage-footer">
          <h6>All rights reserved. Team Contare 2019.</h6>
        </div>
    
      </div>
    )
}

export default withRouter(Homepage)
