import React, { Component } from "react";

import client from '../components/_helpers/fapp';

import Home from './Home';
import Login from './Login';
import TopNav from '../components/TopNav';
import { Loading } from '../components/Loading';

export default class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loggedIn: null
        };

        this.doLogin = this.doLogin.bind(this);

    }

    doLogin() {
        this.setState({
            loggedIn: true
        });
    }

    componentDidMount() {
        // eingeloggt? Home : Login


        client.reAuthenticate().then(() => {
            // show application page
            this.doLogin();
        }).catch(() => {
            // show login page
            this.setState({
                loggedIn: false
            });
        });
    }

    render() {
        const l = this.state.loggedIn;

        if(l === null)
            return <Loading />; 

        return (
            <>
                <TopNav />
                {l ? <Home /> : <Login onLogin={this.doLogin} />}
            </>
        );


        // if (l)
        //   return <Home />;
        // else if (!l)
        //   return <Login onLogin={this.doLogin} />;


        // return (
        //   <View style={styles.container}>
        //     <Text>Loading</Text>
        //   </View>
        // );
    }
}
