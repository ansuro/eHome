import { Platform, View, FlatList } from "react-native";
// import Modal from 'modal-react-native-web';
import { Button, CheckBox, Dialog, makeStyles, useTheme } from "@rneui/themed";
import { useState } from "react";
// import theme from "../utils/Theme";

type TGroup = {
  id: number,
  name: string
};

const DATA: TGroup[] = [{ id: -1, name: 'Alle' }];

for (let i = 0; i < 50; i++) {
  DATA.push({ 'id': i, 'name': 'name' + i });
}

const GroupSelector = () => {
  const [selectedIndex, setIndex] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const styles = useStyles();
  const { theme } = useTheme();

  const renderDialogItem = (group: TGroup) => (
    <CheckBox
      checked={selectedIndex === group.id}
      onPress={() => setIndex(group.id)}
      checkedIcon="dot-circle-o"
      uncheckedIcon="circle-o"
      key={group.id}
      title={group.name}
    />
  );

  const saveDialog = () => {
    setIsDialogOpen(false);
    // TODO Gruppe setzen im Store
  }

  return (
    <View style={styles.container}>
      <Button
        title={'Select Group'}
        type={'outline'}
        containerStyle={styles.btnGroupContainer}
        onPress={() => setIsDialogOpen(true)}
      />
      <Dialog isVisible={isDialogOpen} overlayStyle={styles.dgGroups}>
        <Dialog.Title titleStyle={{ color: theme.colors.primary }} title={'Select Group'} />
        <FlatList
          data={DATA}
          renderItem={({ item }) => renderDialogItem(item)}
          keyExtractor={(group: TGroup, index: number) => group.id.toString()}
        />

        <Dialog.Actions>
          <Dialog.Button title={'OK'} onPress={saveDialog} />
          <Dialog.Button title={'CLOSE'} onPress={() => setIsDialogOpen(false)} />
        </Dialog.Actions>
      </Dialog>
    </View>
  );
}

export default GroupSelector;

const useStyles = makeStyles((theme) => ({
  container: {
    // paddingTop: 5,
    height: 'auto',
    width: '100%',
    backgroundColor: theme.colors.background,
    borderBottomColor: theme.colors.divider,
    borderBottomWidth: 1
  },
  btnGroupContainer: {
    margin: 5,
    width: 200,
    alignSelf: 'center'
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
