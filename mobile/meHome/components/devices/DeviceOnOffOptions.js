import React, { Component } from "react";
import { Layout, Text, Modal, Radio, RadioGroup, Button } from "@ui-kitten/components";

export default class DeviceOnOffOptions extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showOptions: false
        };
    }

    render() {
        const { name, options, value } = this.props.st;
        return (
            <Layout level='1'>
                <Text>{name}</Text>
                <Button onPress={() => this.setState({ showOptions: true })}>{value}</Button>

                <Modal visible={this.state.showOptions}>
                    <Layout level='3'>
                        <Text>TEst</Text>
                        <RadioGroup>
                            {options.map(o => <Radio key={o}>{o}</Radio>)}
                        </RadioGroup>
                    </Layout>
                </Modal>
            </Layout>
        );
    }
}