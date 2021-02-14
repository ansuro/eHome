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

const DrawerContent = ({ navigation, state }) => (
    <Drawer
        selectedIndex={new IndexPath(state.index)}
        onSelect={index => navigation.navigate(state.routeNames[index.row])}>
        <DrawerItem title='Devices' />
        <DrawerItem title='Settings' />
    </Drawer>
);

class Main extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // eingeloggt? Home : Login

        // client.on('authenticated', (jwt) => {
        //     console.log('login event');
        //     appState.login();
        //     console.log(appState.loggedIn);
        // });


        client.reAuthenticate().then(() => {
            // show application page
            // this.doLogin();
            appState.login();
            console.log(appState.loggedIn);
        }).catch(action(() => {
            // show login page
            appState.logout();
            console.log(appState.loggedIn);
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
                </Navigator>
            </NavigationContainer>
        );
        // return (
        //     <>
        //         {/* <TopNav /> */}
        //         <Home />
        //     </>
        // );
    }
}

export default observer(Main);