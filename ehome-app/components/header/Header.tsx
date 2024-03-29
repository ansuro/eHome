import React from 'react';
import { Platform, View } from 'react-native';

import { Icon, Header as RNHeader, Text, makeStyles, useTheme } from '@rneui/themed';

import { DrawerHeaderProps } from '@react-navigation/drawer';

import { appState } from '../../services/store/AppStateObeserver';

const Header = (props: DrawerHeaderProps) => {
  const { theme } = useTheme();
  const styles = useStyles();
  const { navigation, route } = props;

  const leftComponent = (
    <View>
      <Icon name={'menu'} type={'material'} color={theme.colors.black} onPress={() => { navigation.openDrawer(); }} />
    </View>
  );

  const rightComponent = (
    <View>
      {
        appState.connected ?
          <Icon name={'cloud-queue'} type={'material'} color={theme.colors.connected} /> :
          <Icon name={'cloud-off'} type={'material'} color={theme.colors.notconnected} />
      }
    </View>
  );

  const centerComponent = (
    <Text>{route.name}</Text>
  );

  return <RNHeader containerStyle={styles.headerContainer} leftComponent={leftComponent} rightComponent={rightComponent} centerComponent={centerComponent} />;
}

export default Header;

const useStyles = makeStyles((theme) => ({
  headerContainer: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.divider,
    backgroundColor: theme.colors.headerBackground,
    ...Platform.select({
      native: {
        width: '100%'
      },
      web: {
        width: 500,
        alignSelf: 'center'
      }
    })
  }
}));