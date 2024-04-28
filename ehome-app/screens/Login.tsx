import { Button, Card, Input, makeStyles } from "@rneui/themed";
import { Platform, Text, View } from "react-native";
import { Formik, FormikHelpers } from "formik";
import client from "../services/feathers-client";
import useStore from "../services/store/useStore";

interface TLoginFormValues {
  username: string;
  pw: string;
}

const Login = () => {
  const styles = useStyles();
  const appStore = useStore();

  const doLogin = (values: TLoginFormValues, setSubmitting: (isSubmitting: boolean) => void) => {
    const username = values.username.trim();
    const pw = values.pw.trim();

    client.authenticate({
      strategy: 'local',
      username: username,
      password: pw
    }).then(authResult => {
      console.log(authResult);
      appStore.login(authResult);
    }).catch(e => {
      console.log('Login failed: ' + e.message);
    }).finally(() => {
      setSubmitting(false);
    });
  };

  const validateForm = (values: TLoginFormValues) => {
    const errors: any = {};

    values.username = values.username.trim();
    values.pw = values.pw.trim();

    if (!values.username) {
      errors.username = 'Username required';
    } else if (values.username.length < 3 || values.username.length > 25) {
      errors.username = 'Username length must be between 3 and 25';
    }

    if (!values.pw) {
      errors.pw = 'Password required';
    } else if (values.pw.length < 6 || values.pw.length > 25) {
      errors.pw = 'Password length must be between 6 and 25';
    }

    return errors;
  };

  return (
    <Formik
      initialValues={{ username: '', pw: '' }}
      validate={validateForm}
      onSubmit={(values: TLoginFormValues, { setSubmitting }) => doLogin(values, setSubmitting)}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, isSubmitting, isValid }) => (
        <View style={styles.container}>
          <Card containerStyle={styles.logincard}>
            <Card.Title>Login</Card.Title>
            <Input
              placeholder="Username"
              onChangeText={handleChange('username')}
              onBlur={handleBlur('username')}
              value={values.username}
              errorMessage={errors.username}
            />
            <Input
              placeholder="Password"
              secureTextEntry={true}
              onChangeText={handleChange('pw')}
              onBlur={handleBlur('pw')}
              value={values.pw}
              errorMessage={errors.pw}
            />
            <Button disabled={!isValid || isSubmitting} loading={isSubmitting} onPress={handleSubmit as any} title={'Login'} />
          </Card>
        </View>
      )}
    </Formik>
  );
}

export default Login;

const useStyles = makeStyles((theme) => ({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: theme.colors.background,
    justifyContent: 'center'
  },
  logincard: {
    ...Platform.select({
      native: {
        width: '100%'
      },
      web: {
        width: 400,
        alignSelf: 'center'
      }
    })
  }
}));