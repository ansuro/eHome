import { View } from "react-native";
import useScreenContainerStyle from "../../utils/ContainerStyle";
import { Text } from "@rneui/themed";


const TabUserManagement = () => {
  const containerStyle = useScreenContainerStyle();

  return (
    <View style={containerStyle.container}>
      <Text>UserManagement</Text>
    </View>
  );
};

export default TabUserManagement;