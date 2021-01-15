import React, { Component } from 'react';
// import { StyleSheet} from 'react-native';

import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';

import Main from './screens/Main';


class App extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return <ApplicationProvider {...eva} theme={eva.dark}>
      <Main />
    </ApplicationProvider>;
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

export default App;