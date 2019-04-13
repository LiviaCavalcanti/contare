import React, { Component } from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';

import App from './App';
import Pagina404Component from './components/pagina404Component/pagina404Component';

export class Routes extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path="/" exact={true} component={App} />
                    <Route path="/app" component={App} />
                    <Route path="*" component={Pagina404Component} />
                </Switch>
            </ BrowserRouter>
        )
    }
};
