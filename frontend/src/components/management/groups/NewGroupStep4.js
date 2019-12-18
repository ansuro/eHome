import { Panel } from 'primereact/panel';
import React from 'react';
import { BackNext } from '../../../_helpers/backnext';
import client from '../../../_helpers/fclient';
import SaveDialog from '../../../_helpers/SaveDialog';


class NewGroupStep4 extends React.Component {

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
      name: this.props.data.name,
      members: this.props.data.members.map(m => m._id),
      devices: this.props.data.devices.map(d => d._id)
    };

    try {
      await client.service('groups').create(so);
      this.setState({
        saveMsg: `Group "${so.name}" saved.`
      });
    } catch (e) {
      this.setState({
        saveMsg: 'Error: ' + e
      });
    }
  }

  render() {
    if (this.props.step !== 3)
      return null;

    const { isSaving } = this.state;

    return (
      <Panel header="Summary">
        <div className="p-grid">
          <div className="p-col-10 p-offset-1">
            <div className="p-grid">
              <div className="p-col-4">
                <b>Groupname</b><br />{this.props.data.name}
              </div>
              <div className="p-col-4">
                <b>Members</b>
                <ul>
                  {this.props.data.members.map(m => <li key={m._id}>{m.username}</li>)}
                </ul>
              </div>
              <div className="p-col-4">
                <b>Devices</b>
                <ul>
                  {this.props.data.devices.map(d => <li key={d._id}>{d.name}</li>)}
                </ul>
              </div>
            </div>
          </div>
          <div className="p-col-10 p-offset-1">
            <BackNext
              step={this.props.step}
              changeStep={this.props.changeStep}
              nextLabel="save"
              onClick={this.save}
            />
          </div>
        </div>
        {isSaving && <SaveDialog returnURL="/management/groups" msg={this.state.saveMsg} />}
      </Panel>
    );
  }
}

export default NewGroupStep4;