import React, { Component } from "react";
import { View, Text, FlatList, SafeAreaView, StyleSheet } from "react-native";

import client from './_helpers/fapp';

// zwischen Typen unterscheiden, verschieden rendern
const deviceItem = ({ item }) => {
  console.log(item);
  const { name, value, type } = item;
  return (
    <View style={styles.item}>
      <Text>{name}</Text>
      <Text>{value}</Text>
      {/* <Text>{d.type}</Text> */}
    </View>
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
      <SafeAreaView style={styles.container}>
        <Text>HOME</Text>
        <FlatList
          data={this.state.devices}
          keyExtractor={d => d._id}
          renderItem={deviceItem}
        />
      </SafeAreaView>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {

  }
});
