import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";

import { Layout, Button, Input } from "@ui-kitten/components";

import client from '../components/_helpers/fapp';

export default class Login extends Component {

  constructor(props) {
    super(props);

    this.login = this.login.bind(this);

    this.state = {
      username: '',
      password: ''
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
      this.props.onLogin();
    }).catch(e => {
      // login failed
      console.log('login failed');
    });
  }

  render() {
    return (
      <Layout style={styles.container}>
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
    // backgroundColor: rgb(143, 155, 179),
    alignItems: 'center',
    justifyContent: 'center',
  },
  e: {
    width: '95%'
  }
});