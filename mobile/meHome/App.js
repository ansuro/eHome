import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import client from './components/_helpers/fapp';

import Home from './components/Home';
import Login from './components/Login';

class App extends Component {

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
    // client.authenticate().catch(e => {
    //   console.log('catch');
    // });

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
return <Home />;
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;