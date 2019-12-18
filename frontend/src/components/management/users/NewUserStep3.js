import React from 'react';
import client from '../../../_helpers/fclient';
import { Button } from 'primereact/button';
import { AppSpinnerCenter } from '../../AppSpinner';
import { Panel } from 'primereact/panel';
import { Dialog } from 'primereact/dialog';
import { BackNext } from '../../../_helpers/backnext';
import SaveDialog from '../../../_helpers/SaveDialog';

class NewUserStep3 extends React.Component {

  constructor(props) {
    super(props);

    this.save = this.save.bind(this);

    this.state = {
      isSaving: false
    };
  }

  async save() {
    this.setState({
      isSaving: true
    });

    const so = {
      username: this.props.data.username,
      password: this.props.data.password,
      groups: this.props.data.groups.map(g => g._id)
    };

    try {
      console.log(so);
      const user = await this.saveUser();
      console.log(user._id);
      const res = await this.saveMemberships(user._id);
      console.log(res);
      this.setState({
        saveMsg: `User ${user.username} saved.`
      });
    } catch (e) {
      console.log(e);
      this.setState({
        saveMsg: 'Error: ' + e
      });
    }
  }

  async saveUser() {
    return await client.service('users').create({
      username: this.props.data.username,
      password: this.props.data.password,
      admin: this.props.data.admin
    });
  }

  async saveMemberships(id) {
    return await client.service('groups').patch(null, {
      $addToSet: {
        members: id
      }
    }, {
      query: {
        _id: {
          $in: this.props.data.groups.map(g => g._id)
        }
      }
    });
  }

  render() {
    if (this.props.step !== 2)
      return null;

    return (
      <Panel header="Summary">
        <div className="p-grid">
          <div className="p-col-5 p-offset-1">
            <div className="p-grid">
              <div className="p-col-6">
                <b>Username:</b>
              </div>
              <div className="p-col-6">
                {this.props.data.username}
              </div>
              <div className="p-col-6">
                <b>Privilege:</b>
              </div>
              <div className="p-col-6">
                {this.props.data.admin ? 'Administrator' : 'User'}
              </div>
            </div>
          </div>
          <div className="p-col-6">
            <div className="p-grid p-dir-col">
              <div className="p-col-12">
                <b>Groups</b>
              </div>
              {this.props.data.groups.map(g =>
                <div key={g._id} className="p-col-12">
                  {g.name}
                </div>
              )}
            </div>
          </div>
          <div className="p-col-12">
            <BackNext
              step={this.props.step}
              changeStep={this.props.changeStep}
              nextLabel="save"
              onClick={this.save} />
          </div>
        </div>
        {this.state.isSaving && <SaveDialog returnURL="/management/users" msg={this.state.saveMsg} />}
      </Panel>
    );
  }
}

export default NewUserStep3;