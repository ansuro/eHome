import React, { Component } from "react";
import { SafeAreaView, StyleSheet, Platform } from 'react-native';

import { List, Layout } from '@ui-kitten/components';

import { observer } from 'mobx-react';
import { Loading } from "../Loading";
import Device from "./Device";
import { devicesObserver } from '../_helpers/DevicesObserver';


class DeviceList extends Component {

    constructor(props) {
        super(props);

        this.renderDevice = this.renderDevice.bind(this);
    }

    renderDevice({ item }) {
        return (<Device item={item} />);
    }

    render() {
        const { isLoading } = devicesObserver;

        if (isLoading) {
            return <Loading />;
        }
        const { devices } = devicesObserver;

        return (
            <Layout level='1' style={{ flex: 1 }}>
                <SafeAreaView style={{ flex: 1 }}>
                    <List
                        style={styles.list}
                        data={devices.slice()}
                        keyExtractor={d => d._id}
                        renderItem={this.renderDevice}
                    />

                </SafeAreaView>
            </Layout>
        );
    }
}

const styles = StyleSheet.create({
    list: {
        ...Platform.select({
            native: {
                flex: 1
            },
            web: {
                width: 650,
                alignSelf: 'center'
            }
        })
    }
});

export default observer(DeviceList);