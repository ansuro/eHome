import { useEffect } from 'react';
import client from '../../services/feathers-client';
import { IStateOnOff, IStateOnOffOptions, IStateValueOnly, IDevice } from "./DeviceTypes";
import StateOnOff from "./states/StateOnOff";
import StateOnOffOptions from "./states/StateOnOffOptions";
import StateValueOnly from "./states/StateValueOnly";
import { Icon, ListItem, useTheme } from "@rneui/themed";
import { observer } from 'mobx-react';

const Device = observer(({ device }: { device: IDevice }) => {
  const { theme } = useTheme();
  let states = device.states;

  // useEffect(() => {
  //   // Event-Listener für State-Änderungen
  //   const handleStatePatched = (patchedState: any) => {
  //     console.log(`State updated for device ${device.MAC}:`, patchedState);
  //     if (patchedState.MAC === device.MAC) {
  //       // Hier können wir auf die Änderung reagieren
  //       console.log('State changed:', patchedState);
  //       states = states?.map(state => 
  //         state.name === patchedState.name 
  //           ? { ...state, value: patchedState.value } 
  //           : state
  //       );
  //     }
  //     console.log('Updated states:', states);
  //   };

  //   // Listener registrieren
  //   client.service('states').on('patched', handleStatePatched);

  //   // Cleanup beim Unmount
  //   return () => {
  //     client.service('states').removeListener('patched', handleStatePatched);
  //   };
  // }, [states]);

  console.log('Rendering Device component for device:', device);
  return (
    <>
      <ListItem key={device.MAC} bottomDivider topDivider>
        <ListItem.Content>
          <ListItem.Title style={{ fontSize: 18, fontWeight: "bold" }}>{device.name}</ListItem.Title>
        </ListItem.Content>
        <Icon type={'material'} name={'wifi'} color={device.online ? theme.colors.connected : theme.colors.notconnected} />
      </ListItem>
      {
        states?.map(state => {
          switch (state.type) {
            case 0:
              return <StateOnOff key={state.MAC + state.name} state={state as IStateOnOff} disabled={!device.online} />;
            case 1:
              return <StateOnOffOptions key={state.MAC + state.name} state={state as IStateOnOffOptions} disabled={!device.online} />;
            case 2:
              return <StateValueOnly key={state.MAC + state.name} state={state as IStateValueOnly} disabled={!device.online} />;
            default:
              return <StateOnOff key={state.MAC + state.name} state={state as IStateOnOff} disabled={!device.online} />;
          }
        })
      }
    </>
  );
});

export default Device;