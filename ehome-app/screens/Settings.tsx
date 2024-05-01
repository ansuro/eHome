import { View } from "react-native";
import { ListItem, Switch, Text, makeStyles } from "@rneui/themed";
import useScreenContainerStyle from "../utils/ContainerStyle";
import useStore from "../services/store/useStore";

const Settings = () => {
  const containerStyle = useScreenContainerStyle();
  const styles = useStyles();
  const { appState } = useStore();

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