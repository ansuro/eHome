import { ListRenderItem, Platform, SwitchChangeEvent, View } from "react-native";
import { ListItem, Switch, Text, makeStyles } from "@rneui/themed";
import { IStateOnOff } from "../DeviceTypes";
import client from "../../../services/feathers-client";
import { useState } from "react";

type TStateOnOff = {
  state: IStateOnOff;
  disabled: boolean;
};

const StateOnOff = (props: TStateOnOff) => {
  const { state, disabled } = props;
  const [localValue, setLocalValue] = useState(state.value);

  const changeValue = (value: boolean) => {
    console.log('New value:', value);
    setLocalValue(value);

    client.service('states').patch(state.id, { value: value, type: state.type }).then(res => {
      console.log('Patched state successfully:', res);
      if (typeof res.value === 'boolean') {
        setLocalValue(res.value);
        console.log('Updated local state value to:', res.value);
      } else {
        console.error('Patched state value is not boolean:', res.value);
      }
    }).catch(err => {
      console.error('Error patching state:', err);
      setLocalValue(state.value); // Revert to original value on error
    });
  };

  console.log('Rendering StateOnOff with value:', localValue, 'and disabled:', disabled);
  
  return (
    <ListItem bottomDivider>
      <ListItem.Content>
        <ListItem.Title>{state.name}</ListItem.Title>
      </ListItem.Content>
      <Switch
        value={localValue}
        disabled={disabled}
        onValueChange={changeValue}
      />
    </ListItem>
  )
};

export default StateOnOff;
