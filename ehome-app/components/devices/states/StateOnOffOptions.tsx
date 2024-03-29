import { useState } from "react";
import { FlatList, ListRenderItem, Platform, View } from "react-native";
import { Button, Dialog, ListItem, Switch, Text, makeStyles, useTheme } from "@rneui/themed";
import { IDevice, IStateOnOffOptions } from "../DeviceTypes";
import { Icon } from "@rneui/base/dist/Icon";
import OnOffOptionsDialog from "./OnOffOptionsDialog";

type TStateOnOffOptions = {
  state: IStateOnOffOptions;
  disabled: boolean;
};

const StateOnOffOptions = (props: TStateOnOffOptions) => {
  const { state, disabled } = props;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const styles = useStyles();

  const changeValue = (index: number, value: string) => {
    console.log(value);
  };

  const onOffOptions = state.options.flatMap((o, i) => {
    return { index: i, value: o };
  });

  

  return (
    <ListItem bottomDivider>
      <ListItem.Content>
        <ListItem.Title>{state.name}</ListItem.Title>
      </ListItem.Content>
      <Button onPress={() => setIsDialogOpen(true)} disabled={disabled}>
        <Icon role="img" name="options" type="ionicon" iconStyle={styles.iconOptions} />
        <OnOffOptionsDialog options={onOffOptions} valueListener={changeValue} isDialogOpen={isDialogOpen} closeDialog={() => setIsDialogOpen(false)} />
      </Button>
      <Switch  />
    </ListItem>
  );
};

export default StateOnOffOptions;

const useStyles = makeStyles((theme) => ({
  iconOptions: {
    color: theme.colors.background
  }
}));
