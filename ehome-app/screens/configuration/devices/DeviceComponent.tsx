// import client from '../../services/feathers-client';

import { Icon, ListItem, useTheme } from "@rneui/themed";
import { observer } from 'mobx-react';
import { IDevice } from '../../../components/devices/DeviceTypes';
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { NavigationParams } from "../../AppContainer";
import { Device } from "ehome-backend";

const DeviceComponent = observer(({ device }: { device: Device }) => {
  const { theme } = useTheme();
  const navigation = useNavigation<StackNavigationProp<NavigationParams>>();
  console.log('Rendering Device component for device:', device);
  return (
    <>
      <ListItem key={device.MAC} bottomDivider topDivider onPress={() => { navigation.navigate("DeviceEdit", { device }) }}>
        <ListItem.Content>
          <ListItem.Title style={{ fontSize: 18, fontWeight: "bold" }}>{device.name}</ListItem.Title>
        </ListItem.Content>
        <Icon type={'material'} name={'wifi'} color={device.isOnline ? theme.colors.connected : theme.colors.notconnected} />
      </ListItem>
    </>
  );
});

export default DeviceComponent;