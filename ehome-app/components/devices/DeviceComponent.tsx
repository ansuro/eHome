import { useEffect } from 'react';
import client from '../../services/feathers-client';
import { IStateOnOff, IStateOnOffOptions, IStateValueOnly, IDevice } from "./DeviceTypes";
import StateOnOff from "./states/StateOnOff";
import StateOnOffOptions from "./states/StateOnOffOptions";
import StateValueOnly from "./states/StateValueOnly";
import { Icon, ListItem, useTheme } from "@rneui/themed";
import { observer } from 'mobx-react';

const DeviceComponent = observer(({ device }: { device: IDevice }) => {
  const { theme } = useTheme();
  let states = device.states;

  console.log('Rendering Device component for device:', device);
  return (
    <>
      <ListItem key={device.MAC} bottomDivider topDivider>
        <ListItem.Content>
          <ListItem.Title style={{ fontSize: 18, fontWeight: "bold" }}>{device.name}</ListItem.Title>
        </ListItem.Content>
        <Icon type={'material'} name={'wifi'} color={device.isOnline ? theme.colors.connected : theme.colors.notconnected} />
      </ListItem>
      {
        states?.map(state => {
          switch (state.type) {
            case 0:
              return <StateOnOff key={state.MAC + state.name} state={state as IStateOnOff} disabled={!device.isOnline} />;
            case 1:
              return <StateOnOffOptions key={state.MAC + state.name} state={state as IStateOnOffOptions} disabled={!device.isOnline} />;
            case 2:
              return <StateValueOnly key={state.MAC + state.name} state={state as IStateValueOnly} disabled={!device.isOnline} />;
            default:
              return <StateOnOff key={state.MAC + state.name} state={state as IStateOnOff} disabled={!device.isOnline} />;
          }
        })
      }
    </>
  );
});

export default DeviceComponent;