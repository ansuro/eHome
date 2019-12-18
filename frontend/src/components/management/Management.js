import React from 'react';

import { TabView, TabPanel } from 'primereact/tabview';

import DevicesTab from './devices/DevicesTab';
import UsersTab from './users/UsersTab';
import GroupsTab from './groups/GroupsTab';
import LogsTab from './logs/LogsTab';

class Management extends React.Component {

  constructor(props) {
    super(props);
    this.onTabChange = this.onTabChange.bind(this);

    const tab = this.props.match.params.tab;
    switch (tab) {
      case 'devices':
        this.state = { tabIndex: 0 };
        break;
      case 'users':
        this.state = { tabIndex: 1 };
        break;
      case 'groups':
        this.state = { tabIndex: 2 };
        break;
      case 'logs':
        this.state = { tabIndex: 3 };
        break;
      default:
        this.state = { tabIndex: 0 };
        break;
    }
  }

  componentDidUpdate(prevProps) {
    // back/forward button pressed -> change selected tab
    if (this.props.match.params.tab !== prevProps.match.params.tab) {
      const tab = this.props.match.params.tab;
      switch (tab) {
        case 'devices':
          this.setState({ tabIndex: 0 });
          break;
        case 'users':
          this.setState({ tabIndex: 1 });
          break;
        case 'groups':
          this.setState({ tabIndex: 2 });
          break;
        case 'logs':
          this.setState({ tabIndex: 3 });
          break;
        default:
          this.setState({ tabIndex: 0 });
          break;
      }
    }
  }

  onTabChange(e) {
    switch (e.index) {
      case 0:
        this.props.history.push('/management/devices');
        this.setState({ tabIndex: 0 });
        break;
      case 1:
        this.props.history.push('/management/users');
        this.setState({ tabIndex: 1 });
        break;
      case 2:
        this.props.history.push('/management/groups');
        this.setState({ tabIndex: 2 });
        break;
      case 3:
        this.props.history.push('/management/logs');
        this.setState({ tabIndex: 3 });
        break;
      default:
        this.props.history.push('/management/devices');
        this.setState({ tabIndex: 0 });
    }
  }

  render() {
    return (
      <TabView activeIndex={this.state.tabIndex} onTabChange={e => this.onTabChange(e)}>
        <TabPanel header="Devices" leftIcon="pi pi-sitemap">
          <DevicesTab />
        </TabPanel>
        <TabPanel header="Users" leftIcon="pi pi-user-edit">
          <UsersTab />
        </TabPanel>
        <TabPanel header="Groups" leftIcon="pi pi-users">
          <GroupsTab />
        </TabPanel>
        <TabPanel header="Logs" leftIcon="pi pi-file">
          <LogsTab />
        </TabPanel>
      </TabView>
    );
  }
}

export default Management;