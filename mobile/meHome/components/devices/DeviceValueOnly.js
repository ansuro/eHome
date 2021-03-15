import React, { Component } from "react";
import { View } from 'react-native';
import { Text } from "@ui-kitten/components";

import styles from './DeviceCSS';

export default class DeviceValueOnly extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { value, name } = this.props.st;
        return (
            <View style={styles.container}>
                <View style={styles.name}>
                    <Text>{name}</Text>
                </View>
                <View>
                    <Text>{value}</Text>
                </View>
            </View>
        );
    }
}