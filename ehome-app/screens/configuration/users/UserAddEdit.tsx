import { FlatList, View, ScrollView } from "react-native";
import { Icon, ListItem, useTheme, Text, Input, Button, Card, CheckBox } from "@rneui/themed";
import { Group, User } from "ehome-backend";
import useScreenContainerStyle from "../../../utils/ContainerStyle";
import { Formik, } from "formik";
import client from "../../../services/feathers-client";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { useEffect, useState } from "react";
import { NavigationParams } from "../../AppContainer";
import { toJS } from "mobx";
import GroupListItem from "../../../components/groups/GroupListItem";
import useStore from "../../../services/store/useStore";
import GroupListComponent from "./GroupListComponent";

type Props = StackScreenProps<NavigationParams, 'UserAddEdit'>;

function UserAddEdit({ route, navigation }: Props) {
  const { groupsObserver } = useStore();

  // const navigation = useNavigation<StackNavigationProp<NavigationParams>>();
  const { theme } = useTheme();
  const containerStyle = useScreenContainerStyle();

  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<Record<number, boolean>>({});

  const handleCheckChange = (id: number, checked: boolean) => {
    setSelectedGroups((prev) => ({
      ...prev,
      [id]: checked,
    }));
  };

  const existingUser = route.params?.user;
  
  console.log(route.params?.user?.username);
  console.log(route.params?.user?.isAdmin);

  const validateForm = async (user: User) => {
    const errors: any = {};

    user.username = user.username.trim();
    user.password = user.password?.trim();

    if (!user.username) {
      errors.username = 'Name required';
    } else if (user.username.length < 3 || user.username.length > 25) {
      errors.username = 'Name length must be between 3 and 25';
    }
    console.log(user.isAdmin);

    if (!existingUser?.id) {
      if (!user.password) {
        errors.password = 'Password required';
      } else if (user.password.length < 6 || user.password.length > 25) {
        errors.password = 'Password length must be between 6 and 25';
      }
    } else {
      if (existingUser.username !== user.username) {
        try {
          // TODO do case insensitive query TEST
          const g = await client.service('users').find({
            $withGroups: false,
            query: {
              username: user.username,
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

    const newGroups: Group[] = Object.keys(selectedGroups).filter(gidStr => selectedGroups[parseInt(gidStr)]).map(gidStr => {
      console.log('selected group id: ' + gidStr);
      const foundGroup = groups.filter(g => g.id === parseInt(gidStr));
      console.log('found group: %o', foundGroup);
      if (foundGroup.length === 1) {
        console.log('group id ' + gidStr + ' found!');
        return foundGroup[0];
      } else {
        console.log('group id ' + gidStr + ' not found! Length: ' + foundGroup.length);
        return {} as Group;
      }
    });
    console.log('selected groups: %o', selectedGroups);
    console.log('newGroups: %o', newGroups);

    if (existingUser?.id) {
      try {
        // patch existing
        console.log('patching user id ' + existingUser.id);
        console.log(Boolean(values.isAdmin))
        const g = await client.service('users').patch(existingUser.id, {
          username: values.username,
          isAdmin: Boolean(values.isAdmin),
          userGroups: newGroups != null ? newGroups : []
        }) as User;
        console.log('patched');

        // await client.service('membership').remove(null, {
        //   query: {
        //     uid: existingUser.id
        //   }
        // });

        // // TODO CHECK
        // for (const gidStr of Object.keys(selectedGroups)) {
        //   const gid = parseInt(gidStr);
        //   if (selectedGroups[gid]) {
        //     await client.service('membership').create({
        //       uid: existingUser.id,
        //       gid: gid
        //     });
        //   }
        // }

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
          // TODO gruppen
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

  const doDelete = async () => {
    // TODO show confirmation dialog

    if (existingUser?.id) {
      try {
        await client.service('users').remove(existingUser.id);
        console.log('deleted');
        // TODO close screen, show notification

        navigation.goBack();
      } catch (e) {
        console.error('delete failed: ' + e);
      }
    }
  };

  useEffect(() => {
    console.log('loading groups');
    client.service('groups').find({
      paginate: false,
      query: {
        $paginate: false
       }
    }).then(groups => {
      setGroups(groups);
      console.log('loaded groups: %o', groups);
    }).catch(e => {
      console.log('error loading groups: ' + e);
    });

    if (existingUser?.id) {
      client.service('users').get(existingUser.id).then(user => {
        console.log('loaded user: %o', user);
        const selected: Record<number, boolean> = {};
        user.userGroups?.forEach((group: Group) => {
          selected[group.id] = true;
        });
        setSelectedGroups(selected);

      }).catch(e => {
        console.log('error loading group: ' + e);
      });
    }

  }, []);

  return (
    <Formik
        initialValues={{ username: existingUser?.username, id: existingUser?.id, isAdmin: existingUser?.isAdmin || false, password: '' } as User}
        validate={validateForm}
        onSubmit={(values: User, { setSubmitting, setFieldError }) => doSave(values, setSubmitting, setFieldError)}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, isSubmitting, isValid, setFieldValue }) => (
        <View style={containerStyle.container}>
          {/* <Card wrapperStyle={{ padding: 0 }} containerStyle={{ flex: 1 }}> */}
            {/* <View style={{  }}> */}
            <Card>
              <Card.Title>{existingUser?.id ? 'Edit User' : 'Create User'}</Card.Title>
              <Input
                placeholder="Username"
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
                value={values.username}
                errorMessage={errors.username}
              />
              {!existingUser?.id && <Input
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
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Button disabled={!isValid || isSubmitting} loading={isSubmitting} onPress={handleSubmit as any} title={'save'} containerStyle={{ flex: 1, marginRight: 5 }} />
                {existingUser?.id && <Button type="outline" disabled={!isValid || isSubmitting} loading={isSubmitting} onPress={doDelete as any} title={'delete'} containerStyle={{ flex: 1, marginLeft: 5 }} />}
              </View>
              </Card>
            {/* </View> */}
            <Card.Divider />
            <FlatList
              keyExtractor={(group: Group, index: number) => group.id + ""}
              data={groups}
              renderItem={({ item }) => <GroupListComponent key={item.id} group={item} checked={!!selectedGroups[item.id]} onCheckedChange={handleCheckChange} />}
            />
          {/* </Card> */}
        </View>
        )}
      </Formik>
  );
}

export default UserAddEdit;