import React, { Component } from "react";
import { View } from 'react-native';
import { Text, Toggle } from "@ui-kitten/components";

import styles from './DeviceCSS';

export default class DeviceOnOff extends Component {
    constructor(props) {
        super(props);

        this.onSwitchState = this.onSwitchState.bind(this);
    }

    onSwitchState(value) {
        const { name } = this.props.st;
        // console.log('OnOff state: ' + name + ' ' + value);
        this.props.doUpdate({ name, value });
    }

    render() {
        const { disabled } = this.props;
        const { name, value } = this.props.st;
        // console.log(value);
        return (
            <View style={styles.container}>
                <View style={styles.name}>
                    <Text>{name}</Text>
                </View>
                <View style={styles.control}>
                    <Toggle
                        disabled={disabled}
                        checked={value}
                        onChange={b => this.onSwitchState(b)}
                    />
                </View>
            </View>
        );
    }
}

