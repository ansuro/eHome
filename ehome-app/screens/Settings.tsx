import { View } from "react-native";
import { ListItem, Switch, Text, makeStyles, useThemeMode } from "@rneui/themed";
import useScreenContainerStyle from "../utils/ContainerStyle";

import { observer } from "mobx-react";
import useStore from "../services/store/useStore";
import theme from "../utils/Theme";
import { useEffect } from "react";

const Settings = observer(() => {
  const containerStyle = useScreenContainerStyle();
  const styles = useStyles();
  const { appState } = useStore();
  const { setMode } = useThemeMode();

  const colorMode = appState.colorMode == 'light' ? false : true;

  useEffect(() => {
    setMode(appState.colorMode);
  }, [colorMode]);
  // theme.mode = appState.colorMode;
// console.log(appState.colorMode);
  return (
    <View style={containerStyle.container}>
      <Text>Settings: Dark-mode, API-Key, Passwort</Text>
      <ListItem>
        <ListItem.Content>
          <ListItem.Title>darkmode</ListItem.Title>
        </ListItem.Content>
        <Switch value={colorMode} onValueChange={(value) => appState.setColorMode(value ? 'dark' : 'light')} />
      </ListItem>
      <ListItem>
        <ListItem.Content>
          <ListItem.Title>API-Key</ListItem.Title>
        </ListItem.Content>
        <Text selectable>XXXYYYZZZAAABBBCCCDDDEEEFFF</Text>
      </ListItem>
    </View>
  );
});

export default Settings;

const useStyles = makeStyles((theme) => ({

}));