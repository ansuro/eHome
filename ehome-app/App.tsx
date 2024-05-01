import 'react-native-gesture-handler';

import ErrorBoundary from 'react-native-error-boundary';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider } from '@rneui/themed';
import myTheme from './utils/Theme';

import AppNavigationContainer from './screens/AppNavigationContainer';

import { StoreProvider } from './services/store/useStore';
import { AppRootStore } from './services/store/AppRootStore';

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
          <StoreProvider value={new AppRootStore()}>
            <AppNavigationContainer />
          </StoreProvider>
        </ErrorBoundary>
      </SafeAreaProvider>
    </ThemeProvider>
  )
};

export default App;