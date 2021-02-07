import React, { Component } from "react";
import { Layout, Text, List, Toggle, Card, Divider, Button, Icon } from "@ui-kitten/components";
import { SafeAreaView, StyleSheet, View } from "react-native";

import DeviceOnOff from '../components/devices/DeviceOnOff';
import DeviceOnOffOptions from '../components/devices/DeviceOnOffOptions';
import DeviceValueOnly from '../components/devices/DeviceValueOnly';

import client from '../components/_helpers/fapp';
import TopNav from '../components/TopNav';
import { Loading } from '../components/Loading';
import GroupSelecor from '../components/GroupSelector';
import DeviceList from "../components/devices/DeviceList";

import DevicesObserver from '../components/_helpers/DevicesObserver';
import { observer, inject } from "mobx-react";


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

// const DeviceHeader = (headerProps, item) => (
//     <View {...headerProps}>
//         <Text>{item.name}</Text>
//         <Text>{item.online ? 'online ja' : 'online nein'}</Text>
//     </View>
// );

// TODO zwischen Typen unterscheiden, verschieden rendern
// TODO styling, onlinestatus
// const deviceItem = ({ item }) => {
//     console.log(item);
//     const { name, states, online, _id } = item;
//     // let stateElements;// = states.length === 0 ? 'No states' : '';
//     console.log(states);

//     return (
//         <Card header={headerProps => DeviceHeader(headerProps, item)}>
//             {/* <Text></Text> */}
//             {states.map(s => <StateItem did={_id} online={online} st={s} key={s.name} />)}
//         </Card>
//     );
// };

class Home extends Component {
    store;
    constructor(props) {
        super(props);

        this.store = new DevicesObserver();
    }

    componentDidMount() {

        // this.findDevices();

        // client.service('devices').on('patched').then(d => {
        //this.states.devices nach ID durchsuchen und patchen
        // }).catch(e => {
        //   console.log(e);
        // });
    }

    componentWillUnmount() {
        // client.service('devices').off('patched');
    }

    // TODO nach Gruppen filtern
    // findDevices() {
    //     client.service('devices').find().then(ds => {
    //         console.log(ds);
    //         this.setState({
    //             devices: ds.data
    //         });
    //     }).catch(e => {
    //         console.log('findDevices(): ' + e);
    //     });
    // }


    render() {
        let e = (<>
            <GroupSelecor store={this.store} />
            <DeviceList store={this.store} />
        </>);
        
        if (this.store.state === 'loading') {
            e = <Loading />;
        }

        return (
            <Layout level='1' style={{height: '100%'}}>
                <TopNav />
                {e}
            </Layout>
        );
    }
}

export default observer(Home);