import { FlatList, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Button, Divider, Text } from '@rneui/themed';

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

  const groups = groupsObserver ? groupsObserver.groups : [];

  return (
    <View style={containerStyle.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
        <Text h3 h3Style={{ 'textAlign': 'center' }}>Gruppen</Text>
        <Button onPress={() => { navigation.navigate("GroupAddEdit") }} containerStyle={{width: 50}}>+</Button>
      </View>
      <Divider style={{ marginBottom: 10 }} />
      <Divider style={{ marginBottom: 10, marginTop: 10 }} />
      <FlatList
        keyExtractor={(group: Group, index: number) => group.id + ""}
        data={groups.slice()}
        renderItem={({ item }) => <GroupListItem key={item.id} group={item} />}
      />
    </View>
  );
});

export default TabGroupManagement;