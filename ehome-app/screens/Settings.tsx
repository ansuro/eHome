import { Platform, View } from "react-native";
import { Input, ListItem, Switch, Text, makeStyles, useTheme } from "@rneui/themed";
import { appState } from "../services/store/AppStateObeserver";
import { observer } from "mobx-react";
import useScreenContainerStyle from "../utils/ContainerStyle";

const Settings = () => {
  const containerStyle = useScreenContainerStyle();
  const styles = useStyles();

  const colorMode = appState.colorMode == 'light' ? false : true;

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
};

export default Settings;

const useStyles = makeStyles((theme) => ({

}));