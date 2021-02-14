import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import AppMenu from './AppMenu';
import Devices from './Devices';
import Settings from './Settings';
import Frontpage from './Frontpage';
import AppHeader from './AppHeader';
import Management from './management/Management';
import NotFound from './NotFound';
import EditUserView from './management/users/EditUserView';
import NewUserView from './management/users/NewUserView';
import NewGroupView from './management/groups/NewGroupView';
import EditGroupView from './management/groups/EditGroupView';
import EditDeviceView from './management/devices/EditDeviceView';

class AppContainer extends Component {

  constructor(props) {
    super(props);
    this.state = { menuopen: false };
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  toggleMenu(s) {
    this.setState({ menuopen: s });
  }

  render() {
    const mopen = this.state.menuopen;
    const admin = this.props.admin;

    return (
      <div className="p-grid p-nogutter" style={{backgroundColor: '#20262e'}}>
        <div className="p-col-12">
          <AppHeader toggleMenu={this.toggleMenu} />
        </div>
        <div className="p-col-10 p-offset-1" style={{ marginTop: '16px' }}>
          <Switch>
            <Route path="/" exact component={Frontpage} />
            <Route path="/devices" component={Devices} />
            <Route path="/settings" component={Settings} />
            {admin && <Route path="/management/devices/:id" component={EditDeviceView} />}
            {admin && <Route path="/management/users/new" component={NewUserView} />}
            {admin && <Route path="/management/users/:id" component={EditUserView} />}
            {admin && <Route path="/management/groups/new" component={NewGroupView} />}
            {admin && <Route path="/management/groups/:id" component={EditGroupView} />}
            {admin && <Route path="/management/:tab*" component={Management} />}
            <Route component={NotFound} />
          </Switch>
        </div>
        <AppMenu menuopen={mopen} toggleMenu={this.toggleMenu} admin={admin} />
      </div>
    );
  }
}

export default AppContainer;