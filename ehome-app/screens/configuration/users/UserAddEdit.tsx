import { FlatList, View, ScrollView } from "react-native";
import { Icon, ListItem, useTheme, Text, Input, Button, Card, CheckBox } from "@rneui/themed";
import { Group, User } from "ehome-backend";
import useScreenContainerStyle from "../../../utils/ContainerStyle";
import { Formik, } from "formik";
import client from "../../../services/feathers-client";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { useState } from "react";
import { NavigationParams } from "../../AppContainer";
import { toJS } from "mobx";
import GroupListItem from "../../../components/groups/GroupListItem";
import useStore from "../../../services/store/useStore";

type Props = StackScreenProps<NavigationParams, 'UserAddEdit'>;

function UserAddEdit({ route, navigation }: Props) {
  const { groupsObserver } = useStore();

  // const navigation = useNavigation<StackNavigationProp<NavigationParams>>();
  const { theme } = useTheme();
  const containerStyle = useScreenContainerStyle();

  const editMode = route.params?.user ? true : false;
  const user = route.params?.user ? toJS<User>(route.params.user) : { username: '', id: 0, isAdmin: false, password: '' };
  // 0 v 1 = false v true
  user.isAdmin = user.isAdmin ? true : false;

  console.log(route.params?.user?.username);
  console.log(route.params?.user?.isAdmin);

  const groups = groupsObserver ? groupsObserver.groups : [];

  const validateForm = async (values: User) => {
    const errors: any = {};

    values.username = values.username.trim();
    values.password = values.password?.trim();

    if (!values.username) {
      errors.username = 'Name required';
    } else if (values.username.length < 3 || values.username.length > 25) {
      errors.username = 'Name length must be between 3 and 25';
    }
    console.log(values.isAdmin);

    if (!editMode) {
      if (!values.password) {
        errors.password = 'Password required';
      } else if (values.password.length < 6 || values.password.length > 25) {
        errors.password = 'Password length must be between 6 and 25';
      }
    } else {
      if (user.username !== values.username) {
        try {
          // TODO do case insensitive query TEST
          const g = await client.service('users').find({
            $withGroups: false,
            query: {
              username: values.username,
              $limit: 0
            }
          });

          if (g.total > 0) {
            errors.name = 'Username already used.';
          }
        } catch (e) {
          console.log('error checking username: ' + e);
        }
      }
    }
    return errors;
  };

  const doSave = async (values: User, setSubmitting: (isSubmitting: boolean) => void, setFieldError: (field: string, errorMsg: string) => void) => {
    console.log(values);
    setSubmitting(true);

    if (editMode) {
      try {
        // patch existing
        const g = await client.service('users').patch(values.id, {
          username: values.username,
          isAdmin: values.isAdmin
        });
        console.log('patched');
        // TODO close screen, show notification

        navigation.goBack();
      } catch (e) {
        setFieldError('username', 'saving failed');
        console.error('patch failed: ' + e);
      } finally {
        setSubmitting(false);
      }
    } else {
      try {
        // create new
        const g = await client.service('users').create({
          username: values.username,
          password: values.password,
          isAdmin: values.isAdmin
        });
        console.log('saved');
        // TODO close screen, show notification

        navigation.goBack();
      } catch (e) {
        setFieldError('username', 'saving failed');
        console.error('save failed: ' + e);
      } finally {
        setSubmitting(false);
      }
    }
  }

  return (
    <Formik
        initialValues={user}
        validate={validateForm}
        onSubmit={(values: User, { setSubmitting, setFieldError }) => doSave(values, setSubmitting, setFieldError)}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, isSubmitting, isValid, setFieldValue }) => (
    <ScrollView style={containerStyle.container}>
          {/* <Card wrapperStyle={{ padding: 0 }} containerStyle={{ flex: 1 }}> */}
            {/* <View style={{  }}> */}
              <Card.Title>{editMode ? 'Edit User' : 'Create User'}</Card.Title>
              <Input
                placeholder="Username"
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
                value={values.username}
                errorMessage={errors.username}
              />
              {!editMode && <Input
                placeholder="Password"
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                errorMessage={errors.password}
              />}
              <CheckBox
                title={'admin'}
                checked={values.isAdmin}
                onPress={() => setFieldValue('isAdmin', !values.isAdmin)}
              />
            {/* </View> */}
            <Card.Divider />
            <FlatList style={{ height: 300 }}
              keyExtractor={(group: Group, index: number) => group.id + ""}
              data={groups.slice()}
              renderItem={({ item }) => <GroupListItem key={item.id} group={item} />}
            />
            <View style={{ position: "absolute", bottom: 0 }}>
              <Button disabled={!isValid || isSubmitting} loading={isSubmitting} onPress={handleSubmit as any} title={'save'} />
            </View>
          {/* </Card> */}
        </ScrollView>
        )}
      </Formik>
  );
}

export default UserAddEdit;