import React, { Component } from "react";
import { Layout, Select, SelectItem, IndexPath } from "@ui-kitten/components";

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
            <Layout level='2' style={{ margin: '3px' }}>
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

            </Layout>
        );
    }
}

export default observer(GroupSelector);