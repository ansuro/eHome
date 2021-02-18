import React, { Component } from "react";
import { View } from "react-native";
import { Layout, Select, SelectItem, IndexPath, Button, Icon } from "@ui-kitten/components";

import { observer } from 'mobx-react';

import { devicesObserver } from './_helpers/DevicesObserver';

class GroupSelector extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selGrpIdx: new IndexPath(devicesObserver.selectedGroupIndex)
        };
    }

    onGroupSelected(i) {
        this.setState({ selGrpIdx: i });
        devicesObserver.setSelectedGroupIndex(i.row);
    }

    render() {
        const { groups, selectedGroupIndex, noGroups } = devicesObserver;
        const selGrpName = noGroups ? 'No Groups' : groups[selectedGroupIndex].name;

        return (
            <View style={{ margin: 10, flexDirection: 'row' }}>
                {/* <View> */}
                <Button
                    appearance='ghost'
                    accessoryLeft={() => <Icon name='refresh'
                    style={{ height: 16, width: 16 }} />}
                    onPress={() => devicesObserver.reloadDevices()}
                    disabled={devicesObserver.isLoading}
                />
                {/* </View> */}
                <View style={{ flex: 1 }}>
                    <Select
                        placeholder='Select Group'
                        selectedIndex={this.state.selGrpIdx}
                        onSelect={i => this.onGroupSelected(i)}
                        value={selGrpName}
                        disabled={noGroups}
                    >
                        {
                            groups.map(g => <SelectItem title={g.name} key={g._id} />)
                        }
                    </Select>
                </View>
            </View>
        );
    }
}

export default observer(GroupSelector);