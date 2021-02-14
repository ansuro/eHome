import React, { Component } from "react";
import { View, StyleSheet } from 'react-native';
import { Text, Modal, Radio, RadioGroup, Button, Divider } from "@ui-kitten/components";
import styles from "./DeviceCSS";

class OptionsModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedOption: 0
        }

        this.onSave = this.onSave.bind(this);
    }

    componentDidMount() {
        const { options, value } = this.props.st;
        options.forEach((e, i) => {
            if (e === value) {
                this.setState({ selectedOption: i });
            }
        });
    }

    onSave() {
        const { options } = this.props.st;
        const val = options[this.state.selectedOption];
        // console.log(val);

        this.props.onSave(val);
    }

    render() {
        const { options } = this.props.st;
        return (
            <View style={modalstyles.mview}>
                <Text>Select option</Text>
                <Divider />
                <RadioGroup
                    selectedIndex={this.state.selectedOption}
                    onChange={i => this.setState({ selectedOption: i })}>
                    {options.map(o => <Radio key={o}>{o}</Radio>)}
                </RadioGroup>
                <View style={modalstyles.btngrp}>
                    <Button style={modalstyles.btn} onPress={() => this.onSave()}>OK</Button>
                    <Button style={modalstyles.btn} onPress={() => this.props.onClose()}>Cancel</Button>
                </View>
            </View>
        );
    }
}

export default class DeviceOnOffOptions extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showOptions: false
        };

        this.onOptionChanged = this.onOptionChanged.bind(this);
    }

    onOptionChanged(newVal) {
        console.log(newVal);
        const { name } = this.props.st;

        this.props.doUpdate({name, 'value': newVal});

        this.setState({ showOptions: false });
    }



    render() {
        const { name, value } = this.props.st;
        const { disabled } = this.props;

        return (
            <View style={styles.container}>
                <View style={styles.name}>
                    <Text>{name}</Text>
                </View>
                <View>
                    <Button disabled={disabled} onPress={() => this.setState({ showOptions: true })}>{value}</Button>
                </View>
                <Modal
                    visible={this.state.showOptions}
                    onBackdropPress={() => this.setState({ showOptions: false })}
                    backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                    style={modalstyles.mc}>
                    <OptionsModal
                        onSave={this.onOptionChanged}
                        onClose={() => this.setState({ showOptions: false })}
                        st={this.props.st} />
                </Modal>
            </View>
        );
    }
}

const modalstyles = StyleSheet.create({
    mc: {
        width: '95%',
        backgroundColor: '#222B45',
        borderRadius: 4
    },
    mview: {
        // backgroundColor: 'white',
        padding: 5
    },
    btngrp: {
        flex: 1,
        flexDirection: 'row',
        padding: 5,
        justifyContent: 'center'
    },
    btn: {
        minWidth: 100,
        margin: 5,
        flex: 1
    }
});