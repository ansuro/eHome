import { Platform, View, StyleSheet } from "react-native";
import { Icon, Text, makeStyles, useTheme } from "@rneui/themed";

import useScreenContainerStyle, { useTabNavigationStyle } from "../utils/ContainerStyle";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import TabUserManagement from "./configuration/users/TabUserManagement";
import TabDeviceManagement from "./configuration/TabDeviceManagement";
import TabGroupManagement from "./configuration/groups/TabGroupManagement";


/*
TODO: Wie kann man eine Route dem Container hinzufügen und dann unabhängig dahin navigieren?
Oben die Screens addieren
*/
const ConfigurationContainer = () => {
  const { theme } = useTheme();
  const tabStyle = useTabNavigationStyle();
  const screenContainer = useScreenContainerStyle();

  const Tabs = createBottomTabNavigator();

  return (
    <Tabs.Navigator
      initialRouteName={'TabGroups'}
      screenOptions={({ route }) => ({
        headerTitle: () => {
          switch (route.name) {
            case 'Users':
              return "Users";

            case 'TabGroups':
              return "Groups";

            case 'TabDevices':
              return "Devices";
          }
        },
        tabBarIcon: ({ focused, color }) => {
          switch (route.name) {
            case 'Users':
              return <Icon name={'people'} type={'material'} color={color} style={styles.tabIcon} />

            case 'Groups':
              return <Icon name={'groups'} type={'material'} color={color} style={styles.tabIcon} />

            case 'Devices':
              return <Icon name={'devices'} type={'material'} color={color} style={styles.tabIcon} />
          }
        },
        headerShown: false,
        tabBarStyle: tabStyle.container,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.disabled
      })}
      sceneContainerStyle={screenContainer.container}
    >
      <Tabs.Screen key={'TabUsers'} name={'Users'} component={TabUserManagement} />
      <Tabs.Screen key={'TabGroups'} name={'Groups'} component={TabGroupManagement} />
      <Tabs.Screen key={'TabGroups'} name={'Devices'} component={TabDeviceManagement} />
    </Tabs.Navigator>
  );
}

export default ConfigurationContainer;

const styles = StyleSheet.create({
  tabIcon: {
    display: 'flex',
    ...Platform.select({
      web: {
        cursor: 'pointer'
      }
    })
  }
});
