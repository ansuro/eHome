import React, { Component } from 'react';
// import { StyleSheet} from 'react-native';

import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';

import { default as mapping } from './mapping.json';

import Main from './screens/Main';


export default class App extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={eva.dark} customMapping={mapping}>
          <Main />
        </ApplicationProvider>
      </>
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
