import { Platform, View } from "react-native";
import { Text, makeStyles } from "@rneui/themed";
import DeviceList from "../components/devices/DeviceList";
import GroupSelector from "../components/groups/GroupSelector";
import useScreenContainerStyle from "../utils/ContainerStyle";
import { useNavigation } from "@react-navigation/native";
import { NavigationParams } from "./AppContainer";
import { StackNavigationProp } from "@react-navigation/stack";

const Devices = () => {
  const containerStyle = useScreenContainerStyle();
  const navigation = useNavigation<StackNavigationProp<NavigationParams>>();

    return (
      <View style={containerStyle.container}>
        <GroupSelector />
        <DeviceList />
      </View>
    );
  }

  export default Devices;
