import React, { Component } from "react";
// import { Button, TextInput, StyleSheet, View, Text } from "react-native";

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
      this.props.onLogin();
    }).catch(e => {
      // login failed
    });
  }

  render() {
    return (
      <Layout>
        <Input label='Username' onChangeText={t => this.setState({ username: t })} />
        <Input label='Password' secureTextEntry={true} onChangeText={t => this.setState({ password: t })} />
        <Button onPress={() => this.login()}>Login</Button>
      </Layout>
    );
  }
}


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });