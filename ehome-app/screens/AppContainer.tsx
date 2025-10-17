import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useTheme, Dialog } from '@rneui/themed';


import DrawerHeader from '../components/header/DrawerHeader';
import DrawerContent from '../components/header/Drawer';

import Devices from './Devices';
import Settings from './Settings';
import Configuration from './ConfigurationContainer';
import { observer } from 'mobx-react';
import useStore from '../services/store/useStore';
import { Group, User } from 'ehome-backend';

export type NavigationParams = {
  Root: undefined;
  Login: undefined;
  Devices: undefined;
  Settings: undefined;
  Configuration: undefined;
  UserAddEdit: { user: User } | undefined;
  GroupAddEdit: { group: Group } | undefined;
};

const { Navigator, Screen } = createDrawerNavigator<NavigationParams>();

const AppContainer = observer(() => {
  const { userState } = useStore();
  const { theme } = useTheme();

  return (
    <Navigator
      initialRouteName='Configuration'
      screenOptions={{
        header: (props) => <DrawerHeader {...props} />,
        sceneContainerStyle: { backgroundColor: theme.colors.sceneBackground, flex: 1 },
      }}
      drawerContent={props => <DrawerContent {...props} />}
    >
      <Screen name='Devices' component={Devices} />
      <Screen name='Settings' component={Settings} />
      {userState.isAdmin ? (
        <Screen name='Configuration' component={Configuration} />
      ) : null}
    </Navigator>
  );
});

export default AppContainer;
