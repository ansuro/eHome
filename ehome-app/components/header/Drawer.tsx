import type { DrawerContentComponentProps } from "@react-navigation/drawer/lib/typescript/src/types";
import { Divider, ListItem, Text, makeStyles, useTheme } from "@rneui/themed";
import { View } from "react-native";


const DrawerContent = ({ navigation, state }: DrawerContentComponentProps) => {
  const { theme } = useTheme();
  const styles = useStyles();

  const routes = state.routes;

  return (
    <View style={styles.drawerContent}>
      <Text h3 style={{ textAlign: "center" }}>eHome</Text>
      <Divider color={theme.colors.divider} />
      {routes.map(r => (
        <ListItem key={r.key}
          bottomDivider
          onPress={() => navigation.navigate(r.name)}
          containerStyle={state.routeNames[state.index] === r.name ? styles.menuItemActive : styles.menuItem}>
          <ListItem.Content>
            <ListItem.Title style={{ fontWeight: "bold" }}>{r.name}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      ))}
    </View>
  );
}

export default DrawerContent;

const useStyles = makeStyles((theme) => ({
  menuItem: {
    backgroundColor: theme.colors.background
  },
  menuItemActive: {
    backgroundColor: theme.colors.active
  },
  drawerContent: {
    backgroundColor: theme.colors.background,
    borderRightWidth: 1,
    borderRightColor: theme.colors.divider,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
    height: '100%'
  }
}));