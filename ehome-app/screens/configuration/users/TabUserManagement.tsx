import { FlatList, View } from "react-native";
import useScreenContainerStyle from "../../../utils/ContainerStyle";
import { Button, Text } from "@rneui/themed";
import useStore from "../../../services/store/useStore";
import { NavigationParams } from "../../AppContainer";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { User } from "ehome-backend";
import UserListItem from "../../../components/users/UserListItem";
import { observer } from "mobx-react";


const TabUserManagement = observer(() => {
  const { usersObserver } = useStore();
  const containerStyle = useScreenContainerStyle();
  const navigation = useNavigation<StackNavigationProp<NavigationParams>>();

  const users = usersObserver ? usersObserver.users : [];

  return (
    <View style={containerStyle.container}>
      <Text h3 h3Style={{ 'textAlign': 'center' }}>User</Text>
      <Button onPress={() => { navigation.navigate("UserAddEdit") }}>Neu</Button>
      <FlatList
        keyExtractor={(user: User, index: number) => user.id + ""}
        data={users.slice()}
        renderItem={({ item }) => <UserListItem key={item.id} user={item} />}
      />
    </View>
  );
});

export default TabUserManagement;