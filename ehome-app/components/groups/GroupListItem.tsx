import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Icon, ListItem, useTheme } from "@rneui/themed";
import { Group } from "ehome-backend";
import { observer } from "mobx-react";
import { NavigationParams } from "../../screens/AppContainer";

const GroupListItem = observer(({ group }: { group: Group }) => {
  const { theme } = useTheme();
  const navigation = useNavigation<StackNavigationProp<NavigationParams>>();

  return (
    <ListItem key={group.id} bottomDivider topDivider onPress={() => { navigation.navigate("GroupAddEdit", { group }) }}>
      <ListItem.Content>
        <ListItem.Title style={{ fontSize: 18, fontWeight: "bold" }}>{group.name}</ListItem.Title>
      </ListItem.Content>
    </ListItem>
  );
});

export default GroupListItem;