import { Platform, View } from "react-native";
import { Text, makeStyles } from "@rneui/themed";
import DeviceList from "../components/devices/DeviceList";
import GroupSelector from "../components/GroupSelector";
import useScreenContainerStyle from "../utils/ContainerStyle";

const Devices = () => {
  const containerStyle = useScreenContainerStyle();

  return (
    <View style={containerStyle.container}>
      <GroupSelector />
      <DeviceList />
    </View>
  );
}

export default Devices;
