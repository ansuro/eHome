import React from 'react';
import { AppSpinnerCenter } from '../../AppSpinner';
import client from '../../../_helpers/fclient';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Panel } from 'primereact/panel';
import { PickList } from 'primereact/picklist';
import { Message } from 'primereact/message';
import { Subject } from 'rxjs';
import { tap, filter, debounceTime, switchMap } from 'rxjs/operators';
import SaveDialog from '../../../_helpers/SaveDialog';
import { DeleteDialog } from '../../../_helpers/DeleteDialog';

class EditDeviceView extends React.Component {
  nameInput$ = new Subject();
  sub;

  constructor(props) {
    super(props);

    this.onGroupPicklistChange = this.onGroupPicklistChange.bind(this);

    this.save = this.save.bind(this);

    this.state = {
      isLoading: true,
      name: '',
      oldName: '',
      nameChecked: false,
      nameAvailable: true,
      nameChecking: false,
      listChanged: false,
      isSaving: false
    };
  }

  async componentDidMount() {
    this.setState({
      isLoading: true,
      name: ''
    });

    this.sub = this.nameInput$.pipe(
      tap(d => this.setState({ name: d, nameChecked: false })),
      filter(d => d.length > 0 && d !== this.state.oldName),
      debounceTime(800),
      tap(() => this.setState({ nameChecking: true })),
      switchMap(dname => this.nameAvailable(dname)),
    ).subscribe(d => {
      this.setState({
        nameAvailable: d,
        nameChecking: false,
        nameChecked: true
      });
    });


    const id = this.props.match.params.id;
    const device = await client.service('devices').get(id, {
      query: {
        $select: ['_id', 'name', 'MAC']
      }
    });
    const deviceGroups = await client.service('groups').find({
      query: {
        $paginate: false,
        $edit: true,
        devices: id
      }
    });
    const allGroups = await client.service('groups').find({
      query: {
        $paginate: false,
        $edit: true,
        _id: {
          $nin: deviceGroups.map(g => g._id)
        }
      }
    });
    console.log(device);
    this.setState({
      id: device._id,
      name: device.name || '',
      MAC: device.MAC,
      oldName: device.name,
      allGroups: allGroups,
      deviceGroups: deviceGroups,
      isLoading: false
    });
    this.setState({
      delMsg: `Delete device "${this.state.name}" with MAC "${this.state.MAC}"?`
    });
  }

  componentWillUnmount() {
    this.sub.unsubscribe();
  }

  async nameAvailable(name) {
    const a = await client.service('devices').find({
      query: {
        $limit: 0,
        name: name
      }
    });

    return a.total === 0;
  }

  groupTemplate(g) {
    return g.name;
  }

  onGroupPicklistChange(event) {
    this.setState({
      allGroups: event.source,
      deviceGroups: event.target,
      listChanged: true
    });
  }

  async save() {
    this.setState({
      isSaving: true
    });
    console.log(this.state);
    const { id, name } = this.state;
    //save
    try {
      await client.service('devices').patch(id, {
        name: name
      });

      await client.service('groups').patch(null, {
        $pull: {
          devices: id
        }
      });

      await client.service('groups').patch(null, {
        $addToSet: {
          devices: id
        }
      }, {
        query: {
          _id: {
            $in: this.state.deviceGroups.map(d => d._id)
          }
        }
      });
      this.setState({ saveMsg: `Device "${name}" saved.` });
    } catch (e) {
      this.setState({ saveMsg: `Error ${e}` });
    }
  }

  async deleteDevice() {
    this.setState({
      isDeleting: true
    });
    const { id, name } = this.state;

    try {
      await client.service('groups').patch(null, {
        $pull: {
          members: id
        }
      });
      await client.service('devices').remove(id);
      this.setState({
        isDeleting: false,
        delMsg: `Device "${name}" deleted.`
      });
    } catch (e) {
      this.setState({
        isDeleting: false,
        delMsg: `Error: ${e}`
      });
    }
  }

  render() {
    if (this.state.isLoading)
      return <AppSpinnerCenter />;

    const { name, oldName, MAC, nameChecking, nameChecked, nameAvailable, isSaving, saveMsg } = this.state;
    const header = `Device (${oldName ? oldName : 'UNNAMED'} - ${MAC})`

    let nameMsg;
    if (name.length > 0) {
      if (nameChecking) {
        nameMsg = <i className="pi pi-spin pi-spinner" style={{ fontSize: '2em' }}></i>;
      } else if (!nameAvailable) {
        nameMsg = <Message severity="error" text="Name is already taken" />
      }
    }

    const nameChanged = name !== this.state.oldName;
    const nameValid = name.length > 0 && nameAvailable && nameChecked;
    const valid = nameChanged ? nameValid ? true : false : false;
    const formValid = valid || (this.state.listChanged && !nameChanged);

    return (
      <Panel header={header}>
        <div className="p-grid">
          <div className="p-col-6">
            <b>Name</b><hr />
            <InputText
              value={this.state.name}
              onChange={(e) => this.nameInput$.next(e.target.value)}
              style={{ marginRight: '.5em' }}
            />
            {nameMsg}
          </div>
          <div className="p-col-2 p-offset-4">
            <b>Delete</b><hr />
            <Button
              label="delete"
              className="p-button-danger"
              onClick={() => this.setState({ delDiagVisible: true })}
              style={{width: '100%'}}
            />
          </div>
          <div className="p-col-12">
            <b>Group memberships</b><hr />
          </div>
          <div className="p-col-12">
            <PickList
              sourceHeader="Available"
              targetHeader="Selected"
              source={this.state.allGroups}
              target={this.state.deviceGroups}
              showSourceControls={false}
              showTargetControls={false}
              itemTemplate={this.groupTemplate}
              onChange={this.onGroupPicklistChange}
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
              style={{ width: '100%' }}
              disabled={!formValid}
            />
          </div>
        </div>
        {isSaving && <SaveDialog returnURL="/management/devices" msg={saveMsg} />}
        <DeleteDialog
          onDelete={() => this.deleteDevice()}
          onClose={() => this.props.history.push('/management/devices')}
          visible={this.state.delDiagVisible}
          msg={this.state.delMsg}
          isDeleting={this.state.isDeleting}
        />
      </Panel>
    );
  }
}

export default EditDeviceView;