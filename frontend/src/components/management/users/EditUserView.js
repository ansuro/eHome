import React from 'react';

import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { Panel } from 'primereact/panel';
import { PickList } from 'primereact/picklist';
import { Subject } from 'rxjs';
import { debounceTime, filter, switchMap, tap } from 'rxjs/operators';
import client from '../../../_helpers/fclient';
import SaveDialog from '../../../_helpers/SaveDialog';
import { AppSpinnerCenter } from '../../AppSpinner';



class EditUserView extends React.Component {
  nameInput$ = new Subject();
  sub;

  constructor(props) {
    super(props);

    this.onGroupPicklistChange = this.onGroupPicklistChange.bind(this);
    this.save = this.save.bind(this);

    this.state = {
      isLoading: true,
      username: '',
      nameChecking: false,
      nameAvailable: true,
      nameValid: false,
      listChanged: false,
      adminChanged: false
    };
  }

  async componentDidMount() {
    const id = this.props.match.params.id;

    const user = await client.service('users').get(id, {
      query: {
        $select: ['_id', 'username', 'admin']
      }
    });

    const usergroups = await client.service('groups').find({
      query: {
        $paginate: false,
        $edit: true,
        $select: ['_id', 'name'],
        members: id
      }
    });

    const groups = await client.service('groups').find({
      query: {
        $paginate: false,
        $edit: true,
        $select: ['_id', 'name'],
        _id: {
          $nin: usergroups.map(ug => ug._id)
        }
      }
    });

    this.sub = this.nameInput$.pipe(
      tap(g => this.setState({ username: g, nameChecked: false })),
      filter(g => g.length > 0 && g !== this.state.oldUsername),
      debounceTime(800),
      tap(() => this.setState({ nameChecking: true })),
      tap((e) => console.log(this.state.oldUsername)),
      switchMap(name => this.usernameAvailable(name))
    ).subscribe(g => {
      console.log('av ' + g);
      this.setState({
        nameAvailable: g,
        nameChecking: false,
        nameChecked: true
      });
    });

    this.setState({
      id: user._id,
      username: user.username,
      oldUsername: user.username,
      admin: user.admin,
      oldAdmin: user.admin,
      usergroups: usergroups,
      groups: groups,
      isLoading: false
    });
  }

  async usernameAvailable(name) {
    const c = await client.service('users').find({
      query: {
        $limit: 0,
        username: name
      }
    });

    return c.total === 0;
  }

  onGroupPicklistChange(event) {
    this.setState({
      groups: event.source,
      usergroups: event.target,
      listChanged: true
    });
  }

  groupTemplate(group) {
    return group.name;
  }

  async save() {
    this.setState({
      isSaving: true
    });
    const soUser = {
      username: this.state.username,
      admin: this.state.admin
    };
    console.log(this.state.usergroups);

    try {
      await client.service('users').patch(this.state.id, soUser);

      // TODO find a better way, maybe... (delete all entries, add new entries)
      await client.service('groups').patch(null, {
        $pull: {
          members: this.state.id
        }
      });

      await client.service('groups').patch(null, {
        $addToSet: {
          members: this.state.id
        }
      }, {
        query: {
          _id: {
            $in: this.state.usergroups.map(g => g._id)
          }
        }
      });
      this.setState({
        saveMsg: `User "${soUser.username}" saved.`
      });
    } catch (e) {
      this.setState({
        saveMsg: `Error: ${e}`
      });
    }
  }

  render() {
    if (this.state.isLoading)
      return <AppSpinnerCenter />;

    const privileges = [
      { label: 'User', value: false },
      { label: 'Administrator', value: true }
    ];

    const { nameChecking, nameAvailable, nameChecked, username, adminChanged, listChanged, isSaving, saveMsg } = this.state;
    let nameMsg;

    if (username.length > 0) {
      if (nameChecking) {
        nameMsg = <i className="pi pi-spin pi-spinner" style={{ fontSize: '2em' }}></i>;
      } else if (!nameAvailable) {
        nameMsg = <Message severity="error" text="Username is already taken" />
      }
    }

    const nameChanged = username !== this.state.oldUsername;
    const nameValid = username.length > 0 && nameAvailable && nameChecked;
    const valid = nameChanged ? nameValid ? true : false : false;
    const formValid = valid || (listChanged && !nameChanged) || (adminChanged && !nameChanged);

    return (
      <Panel header="Edit User">
        <div className="p-grid">
          <div className="p-col-12">
            <InputText
              value={this.state.username}
              onChange={(e) => this.nameInput$.next(e.target.value)}
              style={{ marginRight: '5px' }}
            // style={{ width: '100%' }}
            />
            {nameMsg}
          </div>
          <div className="p-col-12">
            <Dropdown
              options={privileges}
              value={this.state.admin}
              onChange={(e) => this.setState({ admin: e.value, adminChanged: e.value !== this.state.oldAdmin })}
            // style={{ width: '100%' }}
            />
          </div>
          <div className="p-col-9"></div>
          <div className="p-col-12">
            <b>Group memberships</b><hr />
          </div>
          <div className="p-col-12">
            <PickList
              sourceHeader="Available"
              targetHeader="Selected"
              source={this.state.groups}
              target={this.state.usergroups}
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
        {isSaving && <SaveDialog returnURL="/management/users" msg={saveMsg} />}
      </Panel >
    );
  }
}

export default EditUserView;