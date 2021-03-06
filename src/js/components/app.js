'use strict';

import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import GamePage from './pages/game/gamePage';
import NotFoundPage from './pages/notFound/notFoundPage';
import { LoginPage, RegistrationPage, RecoveryPasswordPage, EmailConfirmPage, ResetPasswordPage } from './pages/authUtils/authUtilsPages'

export default class App extends Component {

    render() {

        //??? должен ли сервер отдавать эти страницы по этим роутам?
        // todo: не переходит по resetPassword/...
        return (
            <Switch>
                <Route exact path="/" component={GamePage} />
                <Route path="/login" component={LoginPage} />
                <Route path="/registration" component={RegistrationPage} />
                <Route path="/recoveryPassword" component={RecoveryPasswordPage} />
                <Route path="/emailConfirm" component={EmailConfirmPage} />
                <Route path="/resetPassword/" component={ResetPasswordPage} />   
                <Route component={NotFoundPage} />              
            </Switch>
        )
    }
}