import React, { Component } from "react";
import { StyleSheet, Text, Platform } from "react-native";

import { Layout, Button, Input } from "@ui-kitten/components";

import client from '../components/_helpers/fapp';
import { appState } from "../components/_helpers/AppStateObserver";

export default class Login extends Component {

    constructor(props) {
        super(props);

        this.login = this.login.bind(this);

        this.state = {
            username: '',
            password: '',
            showError: false
        }
    }

    login() {
        console.log('login()');
        client.authenticate({
            strategy: 'local',
            username: this.state.username,
            password: this.state.password
        }).then(() => {
            // logged in
            console.log('logged in');
            // this.props.onLogin();
            appState.login();
        }).catch(e => {
            // login failed
            console.log('login failed');
            this.setState({ showError: true });
        });
    }

    render() {
        return (
            <Layout style={styles.container}>
                {this.state.showError ? <Text>Login failed</Text> : null}
                <Input style={styles.e} label='Username' onChangeText={t => this.setState({ username: t })} />
                <Input style={styles.e} label='Password' secureTextEntry={true} onChangeText={t => this.setState({ password: t })} />
                <Button style={styles.e} onPress={() => this.login()}>Login</Button>
            </Layout>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        // backgroundColor: rgb(143, 155, 179),
        alignItems: 'center',
        justifyContent: 'center',
    },
    e: {
        ...Platform.select({
            native: {
                width: '95%'
            },
            web: {
                width: 250
            }
        })
    }
});