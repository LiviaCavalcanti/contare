import React from 'react'
import {redirectLoggedUser} from '../../services/userService'
import logo from "assets/img/contare_logo.png";
import HomeNavbar from '../HomeNavbar/HomeNavbar.jsx'

import {withRouter} from 'react-router'
import './Homepage.css'

function Homepage(props) {
    if (localStorage.getItem('token-contare'))
        redirectLoggedUser(localStorage.getItem('token-contare'))

    return (
      <div class="homepage-container">

        <div class="homepage-lead">
          <HomeNavbar/>
          <div class="homepage-lead-content">
          
            <div class="homepage-lead-content-centered">
            
            <h2>Aqui você melhora sua organização financeira e organiza seu dinheiro como nunca!</h2>
              
                {/* <a href="/register" onClick={e => redirect(e, '/register')}>Cadastre-se</a> */}
            </div>
          </div>
        </div>
    
        <div class="homepage-secondary">
          <div class="homepage-secondary-box">
            <h3>Gráficos Intuitivos</h3>
            <p>Visualize graficamente quanto você gasta por categorias personalizadas, como Comida, Viagem, Alguel etc. Selecione períodos para visualizar seu histórico de rendas e gastos ao longo do tempo.</p>
          </div>
          <div class="homepage-secondary-box">
            <h3>Compartilhe gastos</h3>
            <p>Aqui, você pode adicionar amigos e dividir despesas em comum facilmente. Os cálculos de quanto cada um deve é feito automaticamente de acordo com os critérios escolhidos.</p>
          </div>
          <div class="homepage-secondary-box">
            <h3>Exporte seus dados</h3>
            <p>Você também tem a opção de gerar um relatório detalhado para o formato PDF de forma a poder imprimir e visualizá-lo onde quiser.</p>
          </div>
        </div>
    
        <div class="homepage-footer">
          <h6>All rights reserved. Team Contare 2019.</h6>
        </div>
    
      </div>
    )
}

export default withRouter(Homepage)
