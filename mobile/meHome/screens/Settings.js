import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";

import { Layout, Button, Input } from "@ui-kitten/components";

import TopNav from '../components/TopNav';

import client from '../components/_helpers/fapp';
import { appState } from "../components/_helpers/AppStateObserver";

export default class Settings extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Layout level='1' style={{ height: '100%' }}>
                <TopNav {...this.props} />
                Settings
            </Layout>
        );
    }
}