import React from 'react';
import { PickList } from 'primereact/picklist';
import client from '../../../_helpers/fclient';
import { BackNext } from '../../../_helpers/backnext';
import { Panel } from 'primereact/panel';

class NewUserStep2 extends React.Component {

  constructor(props) {
    super(props);

    this.onGroupPicklistChange = this.onGroupPicklistChange.bind(this);

    this.state = {
      groups: [],
      selectedGroups: []
    };
  }

  componentDidMount() {
    client.service('groups').find({
      query: {
        $paginate: false
      }
    }).then(g => {
      console.log(g);
      this.setState({
        groups: g
      });
    }).catch(e => console.error(e));
  }

  onGroupPicklistChange(event) {
    this.setState({
      groups: event.source,
      selectedGroups: event.target
    });
  }

  groupTemplate(group) {
    return group.name;
  }

  render() {
    if (this.props.step !== 1)
      return null;


    return (
      <Panel header="Select Groups">
        <div className="p-grid">
          <div className="p-col-10 p-offset-1">
            <PickList
              sourceHeader="Available"
              targetHeader="Selected"
              source={this.state.groups}
              target={this.state.selectedGroups}
              showSourceControls={false}
              showTargetControls={false}
              itemTemplate={this.groupTemplate}
              onChange={this.onGroupPicklistChange}
              responsive
            />
          </div>
          <div className="p-col-10 p-offset-1">
            <BackNext
              step={this.props.step}
              changeStep={this.props.changeStep}
              data={{ groups: this.state.selectedGroups }}
            />
          </div>
        </div>
      </Panel>
    );
  }
}

export default NewUserStep2;