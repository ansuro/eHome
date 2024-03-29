import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useTheme } from '@rneui/themed';

const { Navigator, Screen } = createDrawerNavigator();

import Header from '../components/header/Header';
import DrawerContent from '../components/header/Drawer';

import Devices from './Devices';
import Settings from './Settings';
import Configuration from './ConfigurationContainer';

const AppContainer = () => {
  const { theme } = useTheme();

  return (
    <NavigationContainer>
      <Navigator
        initialRouteName='Devices'
        screenOptions={{
          header: (props) => <Header {...props} />,
          sceneContainerStyle: { backgroundColor: theme.colors.sceneBackground }
        }}
        drawerContent={props => <DrawerContent {...props} />}
      >
        <Screen name='Devices' component={Devices} />
        <Screen name='Settings' component={Settings} />
        <Screen name='Configuration' component={Configuration} />
      </Navigator>
    </NavigationContainer >
  );
}

export default AppContainer;
