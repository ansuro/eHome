import { FlatList, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Button, Divider, Text } from '@rneui/themed';

import useScreenContainerStyle from "../../../utils/ContainerStyle";
import GroupListItem from "../../../components/groups/GroupListItem";

import { Device, Group } from "ehome-backend";
import { StackNavigationProp } from "@react-navigation/stack";
import { NavigationParams } from "../../AppContainer";
import { observer } from "mobx-react";
import useStore from "../../../services/store/useStore";
import { IDevice } from "../../../components/devices/DeviceTypes";
import DeviceComponent from "./DeviceComponent";
import client from "../../../services/feathers-client";
import { useEffect, useState } from "react";

const TabDeviceManagement = observer(() => {
  const { devicesObserver } = useStore();
  const containerStyle = useScreenContainerStyle();
  const navigation = useNavigation<StackNavigationProp<NavigationParams>>();

  const devices = devicesObserver ? devicesObserver.devices : [];

  console.log('Rendering DeviceList with devices:', devices);
  return (
    <FlatList
      keyExtractor={(device: Device, index: number) => device.id + ""}
      data={devices.slice()}
      renderItem={({ item }) => <DeviceComponent key={item.id} device={item} />}
    />
  );
});

export default TabDeviceManagement;