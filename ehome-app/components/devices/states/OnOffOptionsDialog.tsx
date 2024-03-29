import { CheckBox, Dialog, makeStyles, useTheme } from "@rneui/themed";
import { useState } from "react";
import { FlatList, Platform } from "react-native";
import { IOnOffOption } from "../DeviceTypes";

type TOnOffOptionsDialog = {
  options: IOnOffOption[];
  valueListener(index: number, value: string): void;
  isDialogOpen: boolean;
  closeDialog: Function;
}

const OnOffOptionsDialog = (props: TOnOffOptionsDialog) => {
  const { options, valueListener, isDialogOpen, closeDialog } = props;

  const [selectedIndex, setIndex] = useState(0);

  const { theme } = useTheme();
  const styles = useStyles();

  const renderDialogItem = (option: IOnOffOption) => (
    <CheckBox
      checked={selectedIndex === option.index}
      onPress={() => setIndex(option.index)}
      checkedIcon="dot-circle-o"
      uncheckedIcon="circle-o"
      key={option.index}
      title={option.value}
    />
  );

  const saveDialog = () => {
    valueListener(selectedIndex, options[selectedIndex].value);
    console.log(selectedIndex);
    closeDialog();
  };

  return (
    <Dialog isVisible={isDialogOpen} overlayStyle={styles.dgGroups}>
      <Dialog.Title titleStyle={{color: theme.colors.primary}} title="Select Option" />
      <FlatList
        data={options}
        renderItem={({ item }) => renderDialogItem(item)}
        keyExtractor={(option: IOnOffOption, index: number) => index.toString()}
      />

      <Dialog.Actions>
        <Dialog.Button title={'OK'} onPress={saveDialog} />
        <Dialog.Button title={'CLOSE'} onPress={() => closeDialog()} />
      </Dialog.Actions>
    </Dialog>
  );
};

export default OnOffOptionsDialog;

const useStyles = makeStyles((theme) => ({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: theme.colors.background
  },
  dgGroups: {
    ...Platform.select({
      web: {
        width: 400,
        maxHeight: '90%'
      }
    }),
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.primary,
    borderWidth: 1
  }
}));
