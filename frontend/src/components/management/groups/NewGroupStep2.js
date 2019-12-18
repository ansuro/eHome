import React from 'react';
import client from '../../../_helpers/fclient';
import { PickList } from 'primereact/picklist';
import { BackNext } from '../../../_helpers/backnext';
import { Panel } from 'primereact/panel';

class NewGroupStep2 extends React.Component {

  constructor(props) {
    super(props);

    this.userTemplate = this.userTemplate.bind(this);

    this.onUserPicklistChange = this.onUserPicklistChange.bind(this);

    this.state = {
      users: [],
      selectedUsers: []
    };
  }

  componentDidMount() {
    client.service('users').find({
      query: {
        $paginate: false
      }
    }).then(u => {
      console.log(u);
      this.setState({
        users: u
      });
    }).catch(e => {
      console.error(e);
    });
  }

  userTemplate(user) {
    return user.username;
  }

  onUserPicklistChange(event) {
    this.setState({
      users: event.source,
      selectedUsers: event.target
    });
  }

  render() {
    if (this.props.step !== 1)
      return null;

    return (
      <Panel header="Select members">
        <div className="p-grid">
          <div className="p-col-10 p-offset-1">
            <PickList
              sourceHeader="Available"
              targetHeader="Selected"
              source={this.state.users}
              target={this.state.selectedUsers}
              showSourceControls={false}
              showTargetControls={false}
              itemTemplate={this.userTemplate}
              onChange={this.onUserPicklistChange}
              responsive
            />
          </div>
          <div className="p-col-10 p-offset-1">
            <BackNext step={this.props.step}
              changeStep={this.props.changeStep}
              data={{ members: this.state.selectedUsers }}
            />
          </div>
        </div>
      </Panel>
    );
  }
}

export default NewGroupStep2;