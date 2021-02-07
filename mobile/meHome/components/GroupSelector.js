import React, { Component } from "react";
import { Layout, Select, SelectItem, IndexPath } from "@ui-kitten/components";

import { gid } from './_helpers/DevicesObserver';
import { observer } from 'mobx-react';

import client from './_helpers/fapp';

class GroupSelector extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selGrpIdx: new IndexPath(this.props.store.selectedGroupIndex)
        };
    }

    componentDidMount() {
        // client.service('groups').find({
        //     query: {
        //         $select: ['name'],
        //         $paginate: false
        //     }
        // }).then(g => {
        //     this.setState({
        //         groups: g
        //     });
        //     console.log(g);
        // }).catch(e => {
        //     console.error(e);
        // });
    }

    onGroupSelected(i) {
        this.setState({ selGrpIdx: i });

        const store = this.props.store;
        store.setSelectedGroupIndex(i.row);
    }

    render() {
        const { groups, selectedGroupIndex } = this.props.store;
        
        const selGrp = groups[selectedGroupIndex];
        const selGrpName = selGrp == undefined ? 'No groups' : groups[selectedGroupIndex].name;

        return (
            <Layout level='2' style={{ margin: '3px' }}>
                <Select
                    placeholder='Select Group'
                    selectedIndex={this.state.selGrpIdx}
                    onSelect={i => this.onGroupSelected(i)}
                    value={selGrpName}
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