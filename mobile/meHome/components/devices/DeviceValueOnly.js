import React, { Component } from "react";
import { Layout, Text } from "@ui-kitten/components";

export default class DeviceValueOnly extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { value, name } = this.props.st;
        return (
            <Layout level='1'>
                <Text>{name}</Text>
                <Text>{value}</Text>
            </Layout>
        );
    }
}