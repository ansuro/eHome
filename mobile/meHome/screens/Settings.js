import React, { Component } from "react";
import { StyleSheet, View, Platform } from "react-native";

import { Layout, Button, Input, Text } from "@ui-kitten/components";

import TopNav from '../components/TopNav';

import client from '../components/_helpers/fapp';
import { appState } from "../components/_helpers/AppStateObserver";

export default class Settings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pw1: '',
            pw2: '',
            equal: false,
            showError: false
        }

        this.setText1 = this.setText1.bind(this);
        this.setText2 = this.setText2.bind(this);
        this.changePassword = this.changePassword.bind(this);
    }

    setText1(t) {
        this.setState({
            pw1: t,
            equal: t === this.state.pw2
        });
    }

    setText2(t) {
        this.setState({
            pw2: t,
            equal: t === this.state.pw1
        });
    }

    changePassword() {
        client.service('password').patch(null, {
            pw: this.state.pw1
        }, {}).then(d => {
            console.log(d);
            client.logout();
            appState.logout();
        }).catch(e => {
            console.log(e);
            this.setState({ showError: true });
        });
    }

    render() {
        return (
            <Layout level='1' style={{ height: '100%' }}>
                <TopNav {...this.props} />
                <View style={styles.container}>
                    <Text category='h3'>Change Password</Text>
                    {this.state.showError ? <Text>Password change failed</Text> : null}
                    <Input style={styles.e} secureTextEntry={true} onChangeText={t => this.setText1(t)} />
                    <Input style={styles.e} secureTextEntry={true} onChangeText={t => this.setText2(t)} />
                    <Button style={styles.e} onPress={() => this.changePassword()} disabled={!this.state.equal}>change</Button>
                </View>
            </Layout >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: rgb(143, 155, 179),
        alignItems: 'center'
        // justifyContent: 'center',
        // margin: '3px'
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