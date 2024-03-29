import { View } from "react-native";

import useScreenContainerStyle from "../../utils/ContainerStyle";
import { Text } from "@rneui/themed";

const TabDeviceManagement = () => {
  const containerStyle = useScreenContainerStyle();

  return (
    <View style={containerStyle.container}>
      <Text>TabDeviceManagement</Text>
    </View>
  );
};

export default TabDeviceManagement;