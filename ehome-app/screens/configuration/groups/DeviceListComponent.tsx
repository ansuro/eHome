
import { Icon, ListItem, useTheme } from "@rneui/themed";
import { IDevice } from '../../../components/devices/DeviceTypes';

const DeviceListComponent = ({ device, checked, onCheckedChange }: { device: IDevice, checked: boolean, onCheckedChange: (mac: string, checked: boolean) => void }) => {
  const { theme } = useTheme();

  console.log('Rendering Device component for device:', device);
  return (
    <>
      <ListItem bottomDivider topDivider>
        <ListItem.CheckBox
             iconType="material-community"
             checkedIcon="checkbox-marked"
             uncheckedIcon="checkbox-blank-outline"
             checked={checked} 
             onPress={() => onCheckedChange(device.MAC, !checked)}
           />
        <ListItem.Content>
          <ListItem.Title style={{ fontSize: 18, fontWeight: "bold" }}>{device.name}</ListItem.Title>
        </ListItem.Content>
        <Icon type={'material'} name={'wifi'} color={device.isOnline ? theme.colors.connected : theme.colors.notconnected} />
      </ListItem>
    </>
  );
};

export default DeviceListComponent;