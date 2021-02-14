import React, { Component } from "react";
import { observer } from 'mobx-react';
import { action, isObservable } from 'mobx';

import client from '../components/_helpers/fapp';

import Home from './Home';
import Login from './Login';
import TopNav from '../components/TopNav';
import { Loading } from '../components/Loading';
import { appState } from '../components/_helpers/AppStateObserver';

class Main extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // eingeloggt? Home : Login

        // client.on('authenticated', (jwt) => {
        //     console.log('login event');
        //     appState.login();
        //     console.log(appState.loggedIn);
        // });


        client.reAuthenticate().then(() => {
            // show application page
            // this.doLogin();
            appState.login();
            console.log(appState.loggedIn);
        }).catch(action(() => {
            // show login page
            appState.logout();
            console.log(appState.loggedIn);
        }));
    }

    render() {
        const l = appState.loggedIn;

        if (l === null)
            return <Loading />;

        return (
            <>
                {/* <TopNav /> */}
                {l ? <Home /> : <Login />}
            </>
        );
    }
}

export default observer(Main);