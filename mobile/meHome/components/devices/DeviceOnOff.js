import React, { Component } from "react";
import { Card, Layout, Spinner, Text, Toggle } from "@ui-kitten/components";

import client from '../_helpers/fapp';

export default class DeviceOnOff extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isChanging: false
        };

        this.onSwitchState = this.onSwitchState.bind(this);
    }

    onSwitchState(b) {
        console.log('OnOff state: ' + b);
    }

    render() {
        const { online } = this.props;
        const { name, value } = this.props.st;
        console.log(value);
        const checked = online && value;
        return (
            <Layout style={{flexDirection: 'row', flex: 1}}>
                <Text>{name}</Text>
                <Toggle
                    disabled={!online}
                    checked={checked}
                    onChange={b => this.onSwitchState(b)}
                />
            </Layout>
        );
    }
}