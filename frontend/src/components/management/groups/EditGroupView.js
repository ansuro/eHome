import React from 'react';
import { AppSpinnerCenter } from '../../AppSpinner';
import client from '../../../_helpers/fclient';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Panel } from 'primereact/panel';
import { PickList } from 'primereact/picklist';
import { Subject } from 'rxjs';
import { tap, filter, debounceTime, switchMap } from 'rxjs/operators';
import SaveDialog from '../../../_helpers/SaveDialog';
import { Message } from 'primereact/message';

class EditGroupView extends React.Component {
  nameInput$ = new Subject();
  sub;

  constructor(props) {
    super(props);

    this.userTemplate = this.userTemplate.bind(this);

    this.onUserPicklistChange = this.onUserPicklistChange.bind(this);
    this.onDevicePicklistChange = this.onDevicePicklistChange.bind(this);

    this.save = this.save.bind(this);

    this.state = {
      name: '',
      users: [],
      members: [],
      nameChecking: false,
      nameAvailable: true,
      nameValid: false,
      listChanged: false,
      nameChecked: false
    };
  }

  async componentDidMount() {
    this.setState({
      isLoading: true
    });

    this.sub = this.nameInput$.pipe(
      tap(g => this.setState({ name: g, nameChecked: false })),
      filter(g => g.length > 0 && g !== this.state.oldName),
      debounceTime(800),
      tap(() => this.setState({ nameChecking: true })),
      switchMap(groupname => this.groupnameAvailable(groupname))
    ).subscribe(g => {
      this.setState({
        nameAvailable: g,
        nameChecking: false,
        nameChecked: true
      });
    });

    await this.loadGroup();
    await this.loadUsers();
    await this.loadDevices();
  }

  componentWillUnmount() {
    this.sub.unsubscribe();
  }

  async groupnameAvailable(groupname) {
    const a = await client.service('groups').find({
      query: {
        $limit: 0,
        $edit: true,
        name: groupname
      }
    });

    return a.total === 0;
  }

  async loadGroup() {
    const id = this.props.match.params.id;
    const g = await client.service('groups').get(id);
    const members = await client.service('users').find({
      query: {
        $paginate: false,
        $select: ['_id', 'username'],
        _id: {
          $in: g.members
        }
      }
    });

    const devices = await client.service('devices').find({
      query: {
        $paginate: false,
        $select: ['_id', 'name', 'MAC'],
        _id: {
          $in: g.devices
        }
      }
    });

    this.setState({
      id: g._id,
      name: g.name,
      oldName: g.name,
      members: members,
      devices: devices
    });
  }

  async loadUsers() {
    const us = await client.service('users').find({
      query: {
        $paginate: false,
        $select: ['_id', 'username'],
        _id: {
          $nin: this.state.members.map(u => u._id)
        }
      }
    });

    console.log(this.state.members);
    this.setState({
      users: us
    });
  }

  async loadDevices() {
    const devs = await client.service('devices').find({
      query: {
        $paginate: false,
        $select: ['_id', 'name', 'MAC'],
        name: {
          $exists: true
        },
        _id: {
          $nin: this.state.devices.map(d => d._id)
        }
      }
    });

    console.log(devs);
    this.setState({
      alldevices: devs,
      isLoading: false
    });
  }

  userTemplate(user) {
    return user.username;
  }

  deviceTemplate(device) {
    return `${device.name} (${device.MAC})`;
  }

  onUserPicklistChange(event) {
    this.setState({
      users: event.source,
      members: event.target,
      listChanged: true
    });
  }

  onDevicePicklistChange(event) {
    this.setState({
      alldevices: event.source,
      devices: event.target,
      listChanged: true
    });
  }

  async save() {
    this.setState({
      isSaving: true
    });
    console.log(this.state);

    const so = {
      name: this.state.name,
      members: this.state.members.map(m => m._id),
      devices: this.state.devices.map(d => d._id)
    };

    console.log(so);

    try {
      await client.service('groups').update(this.state.id, so);
      this.setState({ saveMsg: `Group "${so.name}" saved.` });
    } catch (e) {
      this.setState({ saveMsg: `Error ${e}` });
    }
  }

  render() {
    if (this.state.isLoading)
      return <AppSpinnerCenter />;

    const { nameChecking, nameAvailable, nameChecked, name, isSaving } = this.state;
    let nameMsg;

    if (name.length > 0) {
      if (nameChecking) {
        nameMsg = <i className="pi pi-spin pi-spinner" style={{ fontSize: '2em' }}></i>;
      } else if (!nameAvailable) {
        nameMsg = <Message severity="error" text="Groupname is already taken" />
      }
    }

    const nameChanged = name !== this.state.oldName;
    const nameValid = name.length > 0 && nameAvailable && nameChecked;
    const valid = nameChanged ? nameValid ? true : false : false;
    const formValid = valid || (this.state.listChanged && !nameChanged);

    return (
      <Panel header="Edit Group">
        <div className="p-grid">
          <div className="p-col-12">
            <b>Groupname</b>
            <hr />
          </div>
          <div className="p-col-12">
            <InputText value={this.state.name} onChange={(e) => this.nameInput$.next(e.target.value)} style={{ marginRight: '5px' }} />
            {nameMsg}
          </div>
          <div className="p-col-6">
            <b>Members</b>
            <hr />
          </div>
          <div className="p-col-6">
            <b>Devices</b>
            <hr />
          </div>
          <div className="p-col-6">
            <PickList
              sourceHeader="Available"
              targetHeader="Selected"
              source={this.state.users}
              target={this.state.members}
              showSourceControls={false}
              showTargetControls={false}
              itemTemplate={this.userTemplate}
              onChange={this.onUserPicklistChange}
              responsive
            />
          </div>
          <div className="p-col-6">
            <PickList
              sourceHeader="Available"
              targetHeader="Selected"
              source={this.state.alldevices}
              target={this.state.devices}
              showSourceControls={false}
              showTargetControls={false}
              itemTemplate={this.deviceTemplate}
              onChange={this.onDevicePicklistChange}
              responsive
            />
          </div>
          <div className="p-col-2">
            <Button
              label="back"
              onClick={this.props.history.goBack}
              style={{ width: '100%' }}
              className="p-button-secondary"
            />
          </div>
          <div className="p-col-2 p-offset-8">
            <Button
              label="save"
              onClick={this.save}
              disabled={!formValid}
              style={{ width: '100%' }}
            />
          </div>
        </div>
        {isSaving && <SaveDialog returnURL="/management/groups" msg={this.state.saveMsg} />}
      </Panel >
    );
  }
}

export default EditGroupView;