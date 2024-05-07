import { View } from "react-native";
import { Icon, ListItem, useTheme, Text, Input, Button, Card } from "@rneui/themed";
import { Group } from "ehome-backend";
import useScreenContainerStyle from "../../../utils/ContainerStyle";
import { Formik } from "formik";
import client from "../../../services/feathers-client";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

const GroupAddEdit = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const containerStyle = useScreenContainerStyle();

  const validateForm = async (values: Group) => {
    const errors: any = {};

    values.name = values.name.trim();

    if (!values.name) {
      errors.name = 'Name required';
    } else if (values.name.length < 3 || values.name.length > 25) {
      errors.name = 'Name length must be between 3 and 25';
    }

    try {
      // TODO do case insensitive query TEST
      const g = await client.service('groups').find({
        query: {
          findAll: true,
          name: values.name,
          $limit: 0
        }
      });

      if (g.total > 0) {
        errors.name = 'Name already used.';
      }
    } catch (e) {
      console.log('error checking group name: ' + e);
    }
    return errors;
  };

  const doSave = async (values: Group, setSubmitting: (isSubmitting: boolean) => void) => {
    try {
      const g = await client.service('groups').create({
        name: values.name,
        devices: ""
      });
      console.log('saved');
      // TODO close screen, show notification

      navigation.goBack();
    } catch (e) {
      console.error('save failed: ' + e);
    }
  }

  return (
    <Formik
      initialValues={{ name: '', id: 0, devices: '' }}
      validate={validateForm}
      onSubmit={(values: Group, { setSubmitting }) => doSave(values, setSubmitting)}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, isSubmitting, isValid }) => (
        <View style={containerStyle.container}>
          <Card>
            <Card.Title>create group</Card.Title>
            <Input
              placeholder="Name"
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
              errorMessage={errors.name}
            />
            <Button disabled={!isValid || isSubmitting} loading={isSubmitting} onPress={handleSubmit as any} title={'save'} />
          </Card>
        </View>
      )}
    </Formik>
  );
}

export default GroupAddEdit;