import 'react-native-gesture-handler';
import ErrorBoundary from 'react-native-error-boundary';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppContainer from './screens/AppContainer';
import Login from './screens/Login';

import { Dialog, ThemeProvider } from '@rneui/themed';

import { observer } from 'mobx-react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import GroupAddEdit from './screens/configuration/groups/GroupAddEdit';
import StackHeader from './components/header/StackHeader';
import client from './services/feathers-client';
import useStore, { StoreProvider } from './services/store/useStore';
import { AppStateObserver } from './services/store/AppStateObeserver';
import AppNavigationContainer from './screens/AppNavigationContainer';
import myTheme from './utils/Theme';

if (!new class { x: any }().hasOwnProperty('x')) throw new Error('Transpiler is not configured correctly');

const errorHandler = (error: Error, stackTrace: string) => {
  console.log(error.message);
}

const App = () => {

  myTheme.mode = 'dark';
  return (
    <ThemeProvider theme={myTheme}>
      <SafeAreaProvider>
        <ErrorBoundary onError={errorHandler}>
          <StoreProvider value={new AppStateObserver()}>
            <AppNavigationContainer />
          </StoreProvider>
        </ErrorBoundary>
      </SafeAreaProvider>
    </ThemeProvider>
  )
};

export default App;