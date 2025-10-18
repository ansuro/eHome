import { FlatList, Platform } from "react-native";
import { makeStyles } from "@rneui/themed";
import { IDevice } from "./DeviceTypes";

import DeviceComponent from './DeviceComponent';
import { observer } from "mobx-react";
import useStore from "../../services/store/useStore";

// const DATA: IDevice[] = [
//   { name: 'Device1', MAC: 'MAC1', states: [{ id: 123, name: 'Lamp1', type: 0, value: true }], online: true },
//   { name: 'Device2', MAC: 'MAC2', states: [{ id: 456, name: 'Sensor1', type: 2, value: '18.8°' }], online: false },
//   { name: 'Deivce3', MAC: 'MAC3', states: [{ id: 789, name: 'Super Lamp 1', type: 1, value: 'Value 1', options: ['Value 1', 'Value 2', 'Value 3', 'Value 4'] }], online: true }
// ];

const DeviceList = observer(() => {
  const { userState } = useStore();

  const sd = userState.selectedGroup;
  const dev = sd?.devices == undefined ? "[]" : sd?.devices;
  // const devices = JSON.parse(dev);

  const devices: IDevice[] = userState.devices;
  console.log('Rendering DeviceList with devices:', devices);
  return (
    <FlatList
      keyExtractor={(device: IDevice, index: number) => device.MAC}
      data={devices}
      renderItem={({ item }) => <DeviceComponent key={item.MAC} device={item} />}
    />
  );
});

export default DeviceList;

const useStyles = makeStyles((theme) => ({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: theme.colors.background
  },
  deviceList: {
    ...Platform.select({
      native: {
        width: '100%'
      },
      web: {
        width: 400
      }
    })
  }
}));