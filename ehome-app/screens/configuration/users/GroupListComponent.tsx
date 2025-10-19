import { useEffect, useState } from 'react';

import { Icon, ListItem, useTheme } from "@rneui/themed";
import { observer } from 'mobx-react';
import StateOnOff from '../../../components/devices/states/StateOnOff';
import StateOnOffOptions from '../../../components/devices/states/StateOnOffOptions';
import StateValueOnly from '../../../components/devices/states/StateValueOnly';
import { IDevice, IStateOnOff, IStateOnOffOptions, IStateValueOnly } from '../../../components/devices/DeviceTypes';
import { Group } from 'ehome-backend';

const GroupListComponent = ({ group, checked, onCheckedChange }: { group: Group, checked: boolean, onCheckedChange: (gid: number, checked: boolean) => void }) => {
  const { theme } = useTheme();

  console.log('Rendering Group component for device:', group);
  return (
    <>
      <ListItem bottomDivider topDivider>
        <ListItem.CheckBox
             iconType="material-community"
             checkedIcon="checkbox-marked"
             uncheckedIcon="checkbox-blank-outline"
             checked={checked} 
             onPress={() => onCheckedChange(group.id, !checked)}
           />
        <ListItem.Content>
          <ListItem.Title style={{ fontSize: 18, fontWeight: "bold" }}>{group.name}</ListItem.Title>
        </ListItem.Content>
      </ListItem>
    </>
  );
};

export default GroupListComponent;