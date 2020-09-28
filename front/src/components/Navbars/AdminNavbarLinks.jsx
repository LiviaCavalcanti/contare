/*!

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component } from "react";
import {withRouter} from 'react-router';
import { NavItem, Nav} from "react-bootstrap";
import {getUser} from '../../services/userService';
import Invitation from '../Invitation/Invitation'

class AdminNavbarLinks extends Component {

  constructor(props) {
    super(props)
    this.getUserFromToken = this.getUserFromToken.bind(this)
    this.logOut = this.logOut.bind(this)
    this.state = {
      user:{},
      token: localStorage.getItem("token-contare")
    }
  }

  componentWillMount() {
    this.getUserFromToken()
  }

  getUserFromToken = async () => {

    if(this.state.token == null || this.state.token == undefined) {
      window.location.href = "/register"
    } else {
      const user = await getUser(this.state.token)
        if (user) { 
          this.setState({user})
        } else {
          window.location.href = "/register"
        }
      }
  }

  logOut = () => {
    localStorage.removeItem("token-contare")
    this.props.history.push('/login')
  }

  render() {
   
    return (
      <div>
        <Nav pullRight>
          <NavItem >
            <Invitation/>
          </NavItem>
          <NavItem eventKey={1} href="/admin/user" onClick={e => e.preventDefault() &
            this.props.history.push('/admin/user')}>
            Bem-vindo, {this.state.user.name}
          </NavItem>

          <NavItem eventKey={3} href="/login" onClick={e => e.preventDefault() & this.logOut()}>
            Sair
          </NavItem>
        </Nav>
      </div>
    );
  }
}

export default withRouter(AdminNavbarLinks);
