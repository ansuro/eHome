import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { observer } from "mobx-react";
import useStore from "../services/store/useStore";
import client from "../services/feathers-client";
import { Dialog, useTheme, useThemeMode } from "@rneui/themed";
import myTheme from '../utils/Theme';
import AppContainer, { NavigationParams } from "./AppContainer";
import GroupAddEdit from "./configuration/groups/GroupAddEdit";
import StackHeader from "../components/header/StackHeader";
import Login from "./Login";
import { useEffect } from "react";
import UserAddEdit from "./configuration/users/UserAddEdit";

const Stack = createStackNavigator<NavigationParams>();

const AppNavigationContainer = observer(() => {
  const { appState, userState } = useStore();
  const { replaceTheme, theme } = useTheme();
  const { setMode } = useThemeMode();

  console.log('setMode');
  useEffect(() => {
    setMode(appState.colorMode);
  }, [appState.colorMode]);
  const { isLoggedIn, isLoaded: userIsLoaded } = userState;
  const { colorMode, isLoaded: appIsLoaded } = appState;
  // console.log(colorMode);
  // console.log(isLoaded);
  myTheme.mode = colorMode;
  // TODO
  let bg = myTheme.mode == 'light' ? myTheme.lightColors?.sceneBackground : myTheme.darkColors?.sceneBackground;
  bg = bg == undefined ? 'black' : bg;

  return (
    !appIsLoaded && !userIsLoaded && <Dialog.Loading /> ||

    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: bg
        }
      }}>
        {isLoggedIn ?
          <Stack.Group>
            <Stack.Screen name={'Root'} component={AppContainer} />
            <Stack.Screen name={'UserAddEdit'} component={UserAddEdit} options={{ headerShown: true, header: (props) => <StackHeader {...props} /> }} />
            <Stack.Screen name={'GroupAddEdit'} component={GroupAddEdit} options={{ headerShown: true, header: (props) => <StackHeader {...props} /> }} />
          </Stack.Group>
          :
          <Stack.Group>
            <Stack.Screen name={'Login'} component={Login} />
          </Stack.Group>
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
});

export default AppNavigationContainer;