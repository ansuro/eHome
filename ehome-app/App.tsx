import 'react-native-gesture-handler';
import ErrorBoundary from 'react-native-error-boundary';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppContainer from './screens/AppContainer';
import Login from './screens/Login';

import { Dialog, ThemeProvider } from '@rneui/themed';
import theme from './utils/Theme';

import { appState } from './services/store/AppStateObeserver';
import { observer } from 'mobx-react';

const errorHandler = (error: Error, stackTrace: string) => {
  console.log(error.message);
}

const App = observer(() => {

  const isLoggedIn = appState.loggedIn;
  theme.mode = appState.colorMode;

  
  return (
    !appState.isLoaded && <Dialog.Loading /> ||

    <ThemeProvider theme={theme}>
      <SafeAreaProvider>
        <ErrorBoundary onError={errorHandler}>
          {isLoggedIn ?
            <AppContainer />
            : <Login />}
        </ErrorBoundary>
      </SafeAreaProvider>
    </ThemeProvider>
  )
});

export default App;