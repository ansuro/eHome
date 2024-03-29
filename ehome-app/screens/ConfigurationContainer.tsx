import { Platform, View, StyleSheet } from "react-native";
import { Icon, Text, makeStyles, useTheme } from "@rneui/themed";

import useScreenContainerStyle, { useTabNavigationStyle } from "../utils/ContainerStyle";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import TabUserManagement from "./configuration/TabUserManagement";
import TabDeviceManagement from "./configuration/TabDeviceManagement";
import TabGroupManagement from "./configuration/TabGroupManagement";

const ConfigurationContainer = () => {
  const { theme } = useTheme();
  const tabStyle = useTabNavigationStyle();
  const screenContainer = useScreenContainerStyle();

  const Tabs = createBottomTabNavigator();

  return (
    <NavigationContainer independent>
      <Tabs.Navigator
        initialRouteName={'User'}
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color}) => {
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
        <Tabs.Screen name={'Users'} component={TabUserManagement} />
        <Tabs.Screen name={'Groups'} component={TabGroupManagement} />
        <Tabs.Screen name={'Devices'} component={TabDeviceManagement} />
      </Tabs.Navigator>
    </NavigationContainer>
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
