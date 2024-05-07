import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Icon, ListItem, useTheme } from "@rneui/themed";
import { Group, User } from "ehome-backend";
import { observer } from "mobx-react";
import { NavigationParams } from "../../screens/AppContainer";
import { toJS } from "mobx";

const UserListItem = observer(({ user }: { user: User }) => {
  const { theme } = useTheme();
  const nav = useNavigation<StackNavigationProp<NavigationParams>>();

  return (
    <ListItem key={user.id} bottomDivider topDivider onPress={() => nav.navigate('UserAddEdit', { user: user})}>
      <ListItem.Content>
        <ListItem.Title
          style={{ fontSize: 18, fontWeight: "bold" }}>
            {user.username}
        </ListItem.Title>
      </ListItem.Content>
    </ListItem>
  );
});

export default UserListItem;