import React, { Component } from 'react';

import { TopNavigation, TopNavigationAction, Icon, Layout, OverflowMenu, MenuItem, Divider } from '@ui-kitten/components';

import client from './_helpers/fapp';

export default class TopNav extends Component {
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
        // connect, Verbindungsstatus anzeigen
    }

    renderMenu(props) {
        return (
            <OverflowMenu
                visible={this.state.menuVisible}
                anchor={(props) => this.renderMenuActions(props)}
                onBackdropPress={() => this.setState({ menuVisible: !this.state.menuVisible })}>
                <MenuItem title='Logout' onPress={() => this.onLogout()} />
            </OverflowMenu>
        );
    }

    renderMenuActions(props) {
        return <TopNavigationAction
            icon={(props) => <Icon {...props} name='more-vertical' />}
            onPress={() => this.setState({ menuVisible: !this.state.menuVisible })} />
    }

    onLogout() {

    }

    render() {
        return (
            <Layout level='1'>
                <TopNavigation
                    title='meHome'
                    alignment='start'
                    accessoryRight={(p) => this.renderMenu(p)}
                />
                <Divider />
            </Layout>
        );
    }
}