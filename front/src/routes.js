import React, { Component } from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';

import App from './App';
import RegisterScreen from './components/registerComponent/registerComponent'
import NavbarComponent from './components/navbarComponent/navbarComponent'
import Page404Component from './components/page404Component/page404Component';
import DescriptionProject from './components/descriptionProjectComponent/descriptionProjectComponent';
import LoginScreen from './components/loginComponent/loginComponent';
import DashboardComponent from './components/dasboardComponent/dashboardComponent';
import InviteComponent from './components/inviteComponent/inviteComponent'
import { ToastContainer } from 'react-toastify';

export class Routes extends Component {
    render() {
        return (
            <BrowserRouter>
            
            <NavbarComponent/>

                <Switch>
                    <Route path="/" exact={true} component={() => <App component={DescriptionProject}/>} />
                    <Route path="/register" component={() => <App component={RegisterScreen}/>}/>
                    <Route path="/login" component={() => <App component={LoginScreen}/>}/>
                    <Route path="/dashboard" component={() => <DashboardComponent/>}/>
                    <Route path="/invite" component={() => <InviteComponent/>}/>
                    <Route path="*" component={Page404Component} />
                </Switch>
                <ToastContainer />
            </ BrowserRouter>
        )
    }
};
