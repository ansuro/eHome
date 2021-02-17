import React, { Component } from "react";
import { Layout } from "@ui-kitten/components";

import TopNav from '../components/TopNav';
import { Loading } from '../components/Loading';
import GroupSelecor from '../components/GroupSelector';
import DeviceList from "../components/devices/DeviceList";

import { devicesObserver } from '../components/_helpers/DevicesObserver';
import { observer, inject } from "mobx-react";


class Home extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        devicesObserver.init();
    }

    render() {
        let e = (<>
            <GroupSelecor store={this.store} />
            <DeviceList store={this.store} />
        </>);

        if (devicesObserver.isInit) {
            e = <Loading />;
        }

        return (
            <Layout level='1' style={{ height: '100%' }}>
                <TopNav {...this.props} />
                {e}
            </Layout>
        );
    }
}

export default observer(Home);