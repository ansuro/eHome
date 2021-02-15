import React, { Component } from "react";
import { observer } from 'mobx-react';
import { action, isObservable } from 'mobx';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Drawer, DrawerItem, Layout, Text, IndexPath } from '@ui-kitten/components';
const { Navigator, Screen } = createDrawerNavigator();
import client from '../components/_helpers/fapp';

import Home from './Home';
import Login from './Login';
import TopNav from '../components/TopNav';
import { Loading } from '../components/Loading';
import { appState } from '../components/_helpers/AppStateObserver';
import Settings from './Settings';

// NOP component for logout
const Logout = () => {return null;}

const DrawerContent = ({ navigation, state }) => (
    <Drawer
        selectedIndex={new IndexPath(state.index)}
        onSelect={index => {
            console.log(state.routeNames[index.row]);
            if (state.routeNames[index.row] === 'Logout') {
                client.logout();
                appState.logout();
            } else {
                navigation.navigate(state.routeNames[index.row])
            }
        }}>
        <DrawerItem title='Devices' />
        <DrawerItem title='Settings' />
        <DrawerItem title='Logout' />
    </Drawer>
);

class Main extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // eingeloggt? Home : Login
        client.reAuthenticate().then(() => {
            // show application page
            appState.login();
            // console.log(appState.loggedIn);
        }).catch(action(() => {
            // show login page
            appState.logout();
            // console.log(appState.loggedIn);
        }));
    }

    render() {
        const l = appState.loggedIn;

        if (l === null)
            return <Loading />;

        if (!l)
            return <Login />;

        return (
            <NavigationContainer>
                <Navigator drawerContent={props => <DrawerContent {...props} />}>
                    <Screen name='Devices' component={Home} />
                    <Screen name='Settings' component={Settings} />
                    <Screen name='Logout' component={Logout} />
                </Navigator>
            </NavigationContainer>
        );
    }
}

export default observer(Main);