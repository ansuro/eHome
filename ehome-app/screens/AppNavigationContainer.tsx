import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { observer } from "mobx-react";
import useStore from "../services/store/useStore";
import client from "../services/feathers-client";
import { Dialog, useTheme } from "@rneui/themed";
import myTheme from '../utils/Theme';
import AppContainer from "./AppContainer";
import GroupAddEdit from "./configuration/groups/GroupAddEdit";
import StackHeader from "../components/header/StackHeader";
import Login from "./Login";

const Stack = createStackNavigator();

const AppNavigationContainer = observer(() => {
  const { appState, userState } = useStore();
  const { replaceTheme, theme } = useTheme();

  const { isLoggedIn } = userState;
  const { colorMode, isLoaded } = appState;
  console.log(isLoaded);
  myTheme.mode = colorMode;

  let bg = myTheme.mode == 'dark' ? myTheme.darkColors?.sceneBackground : myTheme.lightColors?.sceneBackground
  bg = bg == undefined ? 'black' : bg;

  return (
    !isLoaded && <Dialog.Loading /> ||

    <NavigationContainer>
      {/* <NavigationContainer theme={{ colors: { background: '#2F4858' } }}> */}
      <Stack.Navigator screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: myTheme.mode == 'dark' ? myTheme.darkColors?.sceneBackground : myTheme.lightColors?.sceneBackground
        }
      }}>
        {isLoggedIn ?
          <Stack.Group>
            <Stack.Screen name={'Root'} component={AppContainer} />
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