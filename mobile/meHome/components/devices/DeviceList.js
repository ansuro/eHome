import React, { Component } from "react";
import { View, SafeAreaView, StyleSheet } from 'react-native';

import { List, Card, Text, Icon, Layout } from '@ui-kitten/components';

import { observer } from 'mobx-react';
import { Observer } from 'mobx-react';
import { isObservable } from 'mobx';
import { Loading } from "../Loading";
import Device from "./Device";

// const RenderDeviceHeader = (headerProps, item) => (
//     <Observer>{() =>
//     <View {...headerProps} style={styles.hcontainer}>
//         <Text style={styles.hname}>{item.name}</Text>
//         <Text>{item.online ? <Icon name='wifi' {...headerProps} style={styles.hicon} /> : <Icon name='wifi-off' {...headerProps} style={styles.hicon} />}</Text>
//     </View>
//     }</Observer>
// );

// const StateItem = (props) => {
//     const { type } = props.st;
//     if (type === 0)
//         return <DeviceOnOff {...props} />;
//     else if (type === 1)
//         return <DeviceOnOffOptions {...props} />;
//     else if (type === 2)
//         return <DeviceValueOnly {...props} />;
//     else
//         return 'Unknown state type';
// };

// const DeviceHeader = (props) => {
//     return (
//         <View {...props} style={styles.hcontainer}>
//             <View style={styles.hname}>
//                 <Text>{props.name}</Text>
//             </View>
//             {props.isChanging ? <View><Loading /></View> : ''}
//             <View style={styles.hhicon}>
//                 <Text>{props.online ? <Icon name='wifi' style={styles.hicon} /> : <Icon name='wifi-off' style={styles.hicon} />}</Text>
//             </View>
//         </View>
//     );
// }

class DeviceList extends Component {

    constructor(props) {
        super(props);

        // this.renderDeviceHeader = this.renderDeviceHeader.bind(this);
        this.renderDevice = this.renderDevice.bind(this);
    }

    // renderDeviceHeader = ({ item }) => (
    // return (
    // <Observer>{() =>
    // <View {...headerProps} style={styles.hcontainer}>
    //     <Text style={styles.hname}>{item.name}</Text>
    //     <Text>{item.online ? <Icon name='wifi' {...headerProps} style={styles.hicon} /> : <Icon name='wifi-off' {...headerProps} style={styles.hicon} />}</Text>
    // </View>
    // }</Observer>
    // );
    // )

    renderDevice({ item }) {
        console.log(item);
        console.log(isObservable(item));
        const { name, states, online, _id } = item;
        console.log(isObservable(online));
        // let stateElements;// = states.length === 0 ? 'No states' : '';
        console.log(isObservable(states));

        return (
            <Device item={item} />
            // <Observer>{() => (
            // <Layout level='2' style={styles.container}>
            //     <DeviceHeader {...this.props} name={item.name} online={item.online} />
            //     {
            //         states.map(s => {
            //             if (s.type === 0)
            //                 return <DeviceOnOff {...this.props} did={item._id} online={item.online} st={s} key={s.name} />;
            //             else if (s.type === 1)
            //                 return <DeviceOnOffOptions {...this.props} did={item._id} online={item.online} st={s} key={s.name} />;
            //             else if (s.type === 2)
            //                 return <DeviceValueOnly {...this.props} did={item._id} online={item.online} st={s} key={s.name} />;
            //             else
            //                 return 'Unknown state type';
            //         })
            //     }
            // </Layout>
            // )}</Observer>
            // <Observer>{() => (
            // <Card header={renderDeviceHeader(item)}>
            // {/* {states.map(s => <StateItem did={_id} online={online} st={s} key={s.name} />)} */}
            // {/* </Card> */}
            // )}</Observer>
        );
    }

    render() {
        const { isLoading, selectedGroupIndex } = this.props.store;

        if (isLoading) {
            return <Loading />;
        }
        const { devices } = this.props.store;
        console.log(isObservable(devices));

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
                {/* <Text>Selected Group Idx: {selectedGroupIndex}</Text> */}
            </Layout>
        );
    }
}

const styles = StyleSheet.create({
    list: {
        flex: 1
    }
});

export default observer(DeviceList);