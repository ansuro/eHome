import { ListRenderItem, Platform, View } from "react-native";
import { ListItem, Switch, Text, makeStyles } from "@rneui/themed";
import { IStateOnOff } from "../DeviceTypes";

type TStateOnOff = {
  state: IStateOnOff;
  disabled: boolean;
};

const StateOnOff = (props: TStateOnOff) => {
  const { state, disabled } = props;

  const toggleOnOff = () => {
    // TODO fclient..
  };

  return (
    <ListItem bottomDivider>
      <ListItem.Content>
        <ListItem.Title>{state.name}</ListItem.Title>
      </ListItem.Content>
      <Switch value={state.value} disabled={disabled} onChange={toggleOnOff} />
    </ListItem>
  )
};

export default StateOnOff;
