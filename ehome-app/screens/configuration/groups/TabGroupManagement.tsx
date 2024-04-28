import { FlatList, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Button, Text } from '@rneui/themed';

import useScreenContainerStyle from "../../../utils/ContainerStyle";
import GroupListItem from "../../../components/groups/GroupListItem";

import { Group } from "ehome-backend";
import { StackNavigationProp } from "@react-navigation/stack";
import { NavigationParams } from "../../AppContainer";
import { observer } from "mobx-react";
import useStore from "../../../services/store/useStore";

const TabGroupManagement = observer(() => {
  const { groupsObserver } = useStore();
  const containerStyle = useScreenContainerStyle();
  const navigation = useNavigation<StackNavigationProp<NavigationParams>>();

  const { groups } = groupsObserver;

  return (
    <View style={containerStyle.container}>
      <Text h3 h3Style={{ 'textAlign': 'center' }}>Gruppen</Text>
      <Button onPress={() => { navigation.navigate("GroupAddEdit", {}) }}>Neu</Button>
      <FlatList
        keyExtractor={(group: Group, index: number) => group.id + ""}
        data={groups.slice()}
        renderItem={({ item }) => <GroupListItem key={item.id} group={item} />}
      />
    </View>
  );
});

export default TabGroupManagement;