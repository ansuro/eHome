import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppContainer from './components/AppContainer';
import Login from './components/Login';
import './App.css';
import 'primeflex/primeflex.css';
import client, { isAdmin } from './_helpers/fclient';
import { AppSpinner } from './components/AppSpinner';

import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    client.authenticate().catch(() => {
      this.setState({jwt: null});
    });

    client.on('authenticated', jwt => {
      this.setState({jwt});
      isAdmin().then(a => this.setState({admin: a}));
    });

    client.on('logout', () => {
      this.setState({jwt: null});
    });
  }

  render() {
      if(this.state.jwt === undefined) {
        return <AppSpinner />
      } else if(this.state.jwt) {
        return(
        <BrowserRouter>
          <AppContainer admin={this.state.admin} />
        </BrowserRouter>
        );
      }

      return <Login />;
  }
}

export default App;
