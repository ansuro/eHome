import { IStateOnOff, IStateOnOffOptions, IStateValueOnly, IDevice } from "./DeviceTypes";
import StateOnOff from "./states/StateOnOff";
import StateOnOffOptions from "./states/StateOnOffOptions";
import StateValueOnly from "./states/StateValueOnly";
import { Icon, ListItem, useTheme } from "@rneui/themed";

const Device = ({ device }: { device: IDevice }) => {
  const { theme } = useTheme();

  return (
    <>
      <ListItem key={device.MAC} bottomDivider topDivider>
        <ListItem.Content>
          <ListItem.Title style={{ fontSize: 18, fontWeight: "bold" }}>{device.name}</ListItem.Title>
        </ListItem.Content>
        <Icon type={'material'} name={'wifi'} color={device.online ? theme.colors.connected : theme.colors.notconnected} />
      </ListItem>
      {
        device.states.map(s => {
          switch (s.type) {
            case 0:
              return <StateOnOff key={device.MAC} state={s as IStateOnOff} disabled={!device.online} />;
            case 1:
              return <StateOnOffOptions key={device.MAC} state={s as IStateOnOffOptions} disabled={!device.online} />;
            case 2:
              return <StateValueOnly key={device.MAC} state={s as IStateValueOnly} disabled={!device.online} />;
            default:
              return <StateOnOff key={device.MAC} state={s as IStateOnOff} disabled={!device.online} />;
          }
        })
      }
    </>
  );
};

export default Device;