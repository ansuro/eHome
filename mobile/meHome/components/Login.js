import React, { Component } from "react";
import { Button, TextInput, StyleSheet, View, Text } from "react-native";

import client from './_helpers/fapp';

class Login extends Component {

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
      <View style={styles.container}>
        <Text>Username</Text>
        <TextInput onChangeText={t => this.setState({ username: t })} />
        <Text>Password</Text>
        <TextInput secureTextEntry={true} onChangeText={t => this.setState({ password: t })} />
        <Button onPress={() => this.login} title='Login' />
      </View>
    );
  }
}

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});