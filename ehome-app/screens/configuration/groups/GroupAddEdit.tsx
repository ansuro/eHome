import { FlatList, View } from "react-native";
import { useTheme, Input, Button, Card } from "@rneui/themed";
import { Device, Group } from "ehome-backend";
import useScreenContainerStyle from "../../../utils/ContainerStyle";
import { Formik } from "formik";
import client from "../../../services/feathers-client";
import { useNavigation } from "@react-navigation/native";
import { IDevice } from "../../../components/devices/DeviceTypes";

import { useEffect, useState } from "react";
import DeviceListComponent from "./DeviceListComponent";
import { NavigationParams } from "../../AppContainer";
import { DrawerScreenProps } from "@react-navigation/drawer";

type Props = DrawerScreenProps<NavigationParams, "GroupAddEdit">;

const GroupAddEdit = ({ route }: Props) => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const containerStyle = useScreenContainerStyle();

  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevices, setSelectedDevices] = useState<Record<string, boolean>>({});

  const existingGroup = route.params?.group;

  const handleCheckChange = (mac: string, checked: boolean) => {
    setSelectedDevices((prev) => ({
      ...prev,
      [mac]: checked,
    }));
  };

  const validateForm = async (group: Group) => {
    const errors: any = {};

    group.name = group.name.trim();

    if (!group.name) {
      errors.name = 'Name required';
    } else if (group.name.length < 3 || group.name.length > 25) {
      errors.name = 'Name length must be between 3 and 25';
    }

    if (!existingGroup?.id) {
      try {
        // TODO do case insensitive query TEST
        const g = await client.service('groups').find({
          query: {
            findAll: true,
            name: group.name,
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

  const doSave = async (values: Group, setSubmitting: (isSubmitting: boolean) => void) => {
    setSubmitting(true);
    const selected = JSON.stringify(Object.keys(selectedDevices).filter((mac) => selectedDevices[mac]));
    console.log("Ausgewählte Geräte:", selected);
    if (existingGroup?.id) {
      try {
        const g = await client.service('groups').patch(existingGroup.id, {
          name: values.name,
          devices: selected
        });
        console.log('saved');
        // TODO close screen, show notification

        navigation.goBack();
      } catch (e) {
        console.error('save failed: ' + e);
      } finally {
        setSubmitting(false);
      }
    } else {
      try {
        const g = await client.service('groups').create({
          name: values.name,
          devices: selected
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

  useEffect(() => {
    client.service('devices').find({
      paginate: false,
      query: { $paginate: false }
    }).then(d => {
      d.forEach((device: Device) => {
        setDevices(prevDevices => [...prevDevices, device]);
      });
    });

    if (existingGroup?.id) {
      client.service('groups').get(existingGroup.id).then(g => {
        const deviceMacs = g.devices ? JSON.parse(g.devices) : [];
        const selected: Record<string, boolean> = {};
        deviceMacs.forEach((mac: string) => {
          selected[mac] = true;
        });
        setSelectedDevices(selected);

      }).catch(e => {
        console.log('error loading group: ' + e);
      });
    }

  }, []);

  return (
    <Formik
      initialValues={{ name: existingGroup?.name, id: existingGroup?.id, devices: existingGroup?.devices } as Group}
      validate={validateForm}
      onSubmit={(group: Group, { setSubmitting }) => doSave(group, setSubmitting)}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, isSubmitting, isValid }) => (
        <View style={containerStyle.container}>
          <Card>
            <Card.Title>{existingGroup?.id ? 'Update' : 'Create'} Group</Card.Title>
            <Input
              placeholder="Name"
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
              errorMessage={errors.name}
            />
            <Button disabled={!isValid || isSubmitting} loading={isSubmitting} onPress={handleSubmit as any} title={'save'} />
          </Card>
          <FlatList
            keyExtractor={(device: Device, index: number) => device.MAC}
            data={devices}
            renderItem={({ item }) => <DeviceListComponent key={item.MAC} device={item as IDevice} checked={!!selectedDevices[item.MAC]} onCheckedChange={handleCheckChange} />}
          />
        </View>
      )}
    </Formik>
  );
}

export default GroupAddEdit;