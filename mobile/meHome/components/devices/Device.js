import React, { Component } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Layout, Text, Icon } from '@ui-kitten/components';
import { observer } from 'mobx-react';

import DeviceOnOff from './DeviceOnOff';
import DeviceOnOffOptions from './DeviceOnOffOptions';
import DeviceValueOnly from './DeviceValueOnly';

import { Loading } from "../Loading";
import client from '../_helpers/fapp';
import { appState } from '../_helpers/AppStateObserver';

const DeviceHeader = (props) => {
    return (
        <View {...props} style={styles.hcontainer}>
            <View style={styles.hname}>
                <Text>{props.name}</Text>
            </View>
            {props.isChanging ? <View><Loading /></View> : null}
            <View style={styles.hhicon}>
                <Text>{props.online ? <Icon name='wifi' style={styles.hicon} /> : <Icon name='wifi-off' style={styles.hicon} />}</Text>
            </View>
        </View>
    );
}

class Device extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isChanging: false
        };

        this.doUpdate = this.doUpdate.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.item !== this.props.item) {
            // console.log('device changed');
            this.setState({ isChanging: false });
        }
    }

    doUpdate(stobj) {
        // TODO disabled prop setzen
        // update request
        // disabled prop false setzen on success else error somehow
        // console.log(stobj);
        const { _id } = this.props.item;
        // console.log(_id);

        this.setState({ isChanging: true });
        client.service('devicemanager').patch(_id, stobj).then(d => {
            console.log(d);
            // this.setState({ isChanging: false });
        }).catch(e => {
            console.log(e);
            // this.setState({ isChanging: false });
        });
    }

    render() {
        const device = this.props.item;
        const isChanging = this.state.isChanging;
        const disabled = !device.online || isChanging || !appState.connected;
        return (
            <Layout level='2' style={styles.container}>
                <DeviceHeader {...this.props} name={device.name} online={device.online} isChanging={isChanging} />
                {
                    device.states.map(s => {
                        if (s.type === 0)
                            return <DeviceOnOff {...this.props} disabled={disabled} st={s} key={s.name} doUpdate={this.doUpdate} />;
                        else if (s.type === 1)
                            return <DeviceOnOffOptions {...this.props} disabled={disabled} st={s} key={s.name} doUpdate={this.doUpdate} />;
                        else if (s.type === 2)
                            return <DeviceValueOnly {...this.props} st={s} key={s.name} />;
                        else
                            return 'Unknown state type';
                    })
                }
            </Layout>
        );
    }
}

const styles = StyleSheet.create({
    hicon: {
        width: 32,
        height: 32
    },
    hcontainer: {
        flex: 1,
        flexDirection: 'row',
        height: 50,
        borderStyle: "solid",
        borderBottomWidth: 1
    },
    hname: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    hhicon: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingRight: 5
    },
    container: {
        margin: 10,
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
        borderStyle: "solid",
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1
    }
});

export default observer(Device);