import { FlatList, View } from "react-native";
import { useTheme, Input, Button, Card } from "@rneui/themed";
import { Device } from "ehome-backend";
import useScreenContainerStyle from "../../../utils/ContainerStyle";
import { Formik } from "formik";
import client from "../../../services/feathers-client";
import { useNavigation } from "@react-navigation/native";
import { IDevice } from "../../../components/devices/DeviceTypes";

import { useEffect, useState } from "react";
import { NavigationParams } from "../../AppContainer";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { CardDivider } from "@rneui/base/dist/Card/Card.Divider";
import DeviceListComponent from "../groups/DeviceListComponent";

type Props = DrawerScreenProps<NavigationParams, "DeviceEdit">;

const DeviceEdit = ({ route }: Props) => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const containerStyle = useScreenContainerStyle();

  const device = route.params?.device;

  const validateForm = async (device: Device) => {
    const errors: any = {};

    device.name = device.name.trim();

    if (!device.name) {
      errors.name = 'Name required';
    } else if (device.name.length < 3 || device.name.length > 25) {
      errors.name = 'Name length must be between 3 and 25';
    }

    if (!device?.id) {
      try {
        // TODO do case insensitive query TEST
        const g = await client.service('devices').find({
          query: {
            name: device.name,
            $limit: 0
          }
        });

        if (g.total > 0) {
          errors.name = 'Name already used.';
        }
      } catch (e) {
        console.log('error checking group name: ' + e);
      }
    }
    return errors;
  };

  const doSave = async (values: Device, setSubmitting: (isSubmitting: boolean) => void) => {
    setSubmitting(true);
    if (device?.id) {
      try {
        const g = await client.service('devices').patch(device.id, {
          name: values.name
        });
        console.log('saved');
        // TODO close screen, show notification

        navigation.goBack();
      } catch (e) {
        console.error('save failed: ' + e);
      } finally {
        setSubmitting(false);
      }
    }
  }

  // CHECKME doReset devices somehow?
  const doDelete = async () => {
    // TODO show confirmation dialog

    if (device?.id) {
      try {
        await client.service('groups').remove(device.id);
        console.log('deleted');
        // TODO close screen, show notification

        navigation.goBack();
      } catch (e) {
        console.error('delete failed: ' + e);
      }
    }
  };

  // useEffect(() => {
  //   client.service('devices').find({
  //     paginate: false,
  //     query: { $paginate: false }
  //   }).then(devices => {
  //       setDevices(devices);
  //   });

  //   if (existingGroup?.id) {
  //     client.service('groups').get(existingGroup.id).then(g => {
  //       const deviceMacs = g.devices ? JSON.parse(g.devices) : [];
  //       const selected: Record<string, boolean> = {};
  //       deviceMacs.forEach((mac: string) => {
  //         selected[mac] = true;
  //       });
  //       setSelectedDevices(selected);

  //     }).catch(e => {
  //       console.log('error loading group: ' + e);
  //     });
  //   }

  // }, []);

  return (
    <Formik
      initialValues={{ name: device?.name, id: device?.id } as Device}
      validate={validateForm}
      onSubmit={(device: Device, { setSubmitting }) => doSave(device, setSubmitting)}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, isSubmitting, isValid }) => (
        <View style={containerStyle.container}>
          <Card>
            <Card.Title>Update Device</Card.Title>
            <Card.FeaturedTitle>MAC: {device?.MAC}</Card.FeaturedTitle>
            <Card.FeaturedTitle>Name: {device?.name}</Card.FeaturedTitle>
            <Card.FeaturedTitle>DB-Id: {device?.id}</Card.FeaturedTitle>
            <Input
              placeholder="Name"
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
              errorMessage={errors.name}
            />
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Button disabled={!isValid || isSubmitting} loading={isSubmitting} onPress={handleSubmit as any} title={'save'} containerStyle={{ flex: 1, marginRight: 5 }} />
              {device?.id && <Button type="outline" disabled={!isValid || isSubmitting} loading={isSubmitting} onPress={doDelete as any} title={'delete'} containerStyle={{ flex: 1, marginLeft: 5 }} />}
            </View>
          </Card>
          <CardDivider />
          {/* <FlatList
            keyExtractor={(device: Device, index: number) => device.MAC}
            data={devices}
            renderItem={({ item }) => <DeviceListComponent key={item.MAC} device={item as IDevice} checked={!!selectedDevices[item.MAC]} onCheckedChange={handleCheckChange} />}
          /> */}
        </View>
      )}
    </Formik>
  );
}

export default DeviceEdit;