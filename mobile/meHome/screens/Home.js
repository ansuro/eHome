import React, { Component } from "react";
import { Layout, Text, List } from "@ui-kitten/components";
import { SafeAreaView, StyleSheet } from "react-native";

import client from '../components/_helpers/fapp';

// TODO zwischen Typen unterscheiden, verschieden rendern
const deviceItem = ({ item }) => {
  console.log(item);
  const { name, value, type } = item;
  return (
    <Layout>
      <Text>{name}</Text>
      <Text>{value}</Text>
      {/* <Text>{d.type}</Text> */}
    </Layout>
  )
};
export default class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      devices: [
        { _id: '1', name: 'Device1', type: 0, value: 'on' },
        { _id: '2', name: 'Device2', type: 0, value: 'on' },
        { _id: '3', name: 'Device3', type: 0, value: 'on' }
      ]
    };

  }

  componentDidMount() {
    this.findDevices();

    // client.service('devices').on('patched').then(d => {

    // }).catch(e => {
    //   console.log(e);
    // });
  }

  componentWillUnmount() {
    // client.service('devices').off('patched');
  }

  findDevices() {
    // client.service('devices').find({}).then(ds => {}).catch(e => {});
  }


  render() {
    return (
      <SafeAreaView >
        {/* <Text>HOME</Text> */}
        <List
          data={this.state.devices}
          keyExtractor={d => d._id}
          renderItem={deviceItem}
        />
        
      </SafeAreaView>
    );
  }
}

