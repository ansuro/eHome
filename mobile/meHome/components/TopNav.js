import React, { Component } from 'react';
import { StyleSheet } from 'react-native';

import { TopNavigation, TopNavigationAction, Icon, Layout, OverflowMenu, MenuItem, Divider } from '@ui-kitten/components';

import client from './_helpers/fapp';

import { appState } from './_helpers/AppStateObserver';
import { observer } from 'mobx-react';

class TopNav extends Component {
    constructor(props) {
        super(props);

        this.state = {
            menuVisible: false
        };

        this.renderMenu = this.renderMenu.bind(this);
        this.renderMenuActions = this.renderMenuActions.bind(this);
        this.onLogout = this.onLogout.bind(this);
    }

    componentDidMount() {
    }

    renderMenu(props, c) {
        // console.log('renderMenu');
        return (
            <>
                {c ? <Icon name='bulb' style={styles.cbulb} /> : <Icon name='bulb-outline' style={styles.dbulb} />}
                <OverflowMenu
                    visible={this.state.menuVisible}
                    anchor={(props) => this.renderMenuActions(props)}
                    onBackdropPress={() => this.setState({ menuVisible: !this.state.menuVisible })}>
                    <MenuItem title='Logout' onPress={() => this.onLogout()} />
                </OverflowMenu>
            </>
        );
    }

    renderMenuActions(props) {
        return <TopNavigationAction
            icon={(props) => <Icon {...props} name='more-vertical' />}
            onPress={() => this.setState({ menuVisible: !this.state.menuVisible })} />
    }

    // TODO
    onLogout() {
        client.logout();
        appState.logout();
    }

    render() {
        const c = appState.connected;
            return(
                <Layout level='1'>
                    <TopNavigation
                        title='meHome'
                        alignment='start'
                        accessoryRight={(p) => this.renderMenu(p, c)}
                    />
                    <Divider />
                </Layout>
            );
    }
}

const styles = StyleSheet.create({
    cbulb: {
        width: 32,
        height: 32
    },
    dbulb: {
        width: 32,
        height: 32
    }
});

export default observer(TopNav);