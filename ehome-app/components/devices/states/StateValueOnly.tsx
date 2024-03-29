import { Platform, View } from "react-native";
import { ListItem, makeStyles, useTheme } from "@rneui/themed";
import { IStateValueOnly } from "../DeviceTypes";

type TStateValueOnly = {
  state: IStateValueOnly;
  disabled: boolean;
};

const StateValueOnly = (props: TStateValueOnly) => {
  const { state, disabled } = props;

  const styles = useStyles();

  return (
    <ListItem bottomDivider containerStyle={styles.container}>
      <ListItem.Content>
        <ListItem.Title disabled={disabled}>{state.name}</ListItem.Title>
        <ListItem.Title disabled={disabled} style={styles.value}>{state.value}</ListItem.Title>
      </ListItem.Content>
    </ListItem>
  )
};

export default StateValueOnly;

const useStyles = makeStyles((theme) => ({
  container: {
    borderColor: theme.colors.divider
  },
  value: {
    alignSelf: 'flex-end'
  }
}));
