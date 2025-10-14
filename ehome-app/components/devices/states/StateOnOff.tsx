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

  const changeValue = async (value: boolean) => {
    console.log('New value:', value);

    await client.service('device-manager').patch(null, { value: value, MAC: state.MAC, name: state.name, type: state.type } );

  };

  console.log('Rendering StateOnOff with value:', state.value, 'and disabled:', disabled);
  
  return (
    <ListItem bottomDivider>
      <ListItem.Content>
        <ListItem.Title>{state.name}</ListItem.Title>
      </ListItem.Content>
      <Switch
        value={state.value}
        disabled={disabled}
        onValueChange={changeValue}
      />
    </ListItem>
  )
};

export default StateOnOff;
