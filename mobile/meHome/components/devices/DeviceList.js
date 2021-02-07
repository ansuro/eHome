import React, { Component } from "react";
import { View, SafeAreaView } from 'react-native';

import { List, Card, Text } from '@ui-kitten/components';

import DeviceOnOff from './DeviceOnOff';
import DeviceOnOffOptions from './DeviceOnOffOptions';
import DeviceValueOnly from './DeviceValueOnly';

import { observer } from 'mobx-react';

const RenderDeviceHeader = (headerProps, item) => (
    <View {...headerProps}>
        <Text>{item.name}</Text>
        <Text>{item.online ? 'online ja' : 'online nein'}</Text>
    </View>
);

const StateItem = (props) => {
    const { type } = props.st;
    if (type === 0)
        return <DeviceOnOff {...props} />;
    else if (type === 1)
        return <DeviceOnOffOptions {...props} />;
    else if (type === 2)
        return <DeviceValueOnly {...props} />;
    else
        return 'Unknown state type';
};

class DeviceList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            devices: [
                { _id: '1', name: 'Device1', online: true, states: [{name: 'Test1', value: true, type: 0}] }
                // { _id: '2', name: 'Device2', type: 0, value: 'on' },
                // { _id: '3', name: 'Device3', type: 0, value: 'on' }
            ]
        };
    }

    renderDevice({ item }) {
        console.log(item);
        const { name, states, online, _id } = item;
        // let stateElements;// = states.length === 0 ? 'No states' : '';
        console.log(states);

        return (
            <Card header={headerProps => RenderDeviceHeader(headerProps, item)}>
                {states.map(s => <StateItem did={_id} online={online} st={s} key={s.name} />)}
            </Card>
        );
    }

    render() {
        const { groups, selectedGroupIndex } = this.props.store;

        return (
            <View>
                <SafeAreaView >
                    {/* <Text>HOME</Text> */}
                    <List
                        data={groups[selectedGroupIndex].devices}
                        keyExtractor={d => d._id}
                        renderItem={this.renderDevice}
                    />

                </SafeAreaView>
                <Text>Selected Group Idx: {selectedGroupIndex}</Text>
            </View>
        );
    }
}

export default observer(DeviceList);