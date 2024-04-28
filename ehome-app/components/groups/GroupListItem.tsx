import { Icon, ListItem, useTheme } from "@rneui/themed";
import { Group } from "ehome-backend";
import { observer } from "mobx-react";

const GroupListItem = observer(({ group }: { group: Group }) => {
  const { theme } = useTheme();

  return (
    <ListItem key={group.id} bottomDivider topDivider>
      <ListItem.Content>
        <ListItem.Title style={{ fontSize: 18, fontWeight: "bold" }}>{group.name}</ListItem.Title>
      </ListItem.Content>
    </ListItem>
  );
});

export default GroupListItem;