import React from 'react';
import { PickList } from 'primereact/picklist';
import { BackNext } from '../../../_helpers/backnext';
import client from '../../../_helpers/fclient';
import { Panel } from 'primereact/panel';

class NewGroupStep3 extends React.Component {

  constructor(props) {
    super(props);

    this.deviceTemplate = this.deviceTemplate.bind(this);

    this.onDevicePicklistChange = this.onDevicePicklistChange.bind(this);

    this.state = {
      devices: [],
      selectedDevices: []
    };
  }

  componentDidMount() {
    client.service('devices').find({
      query: {
        $paginate: false,
        name: {
          $exists: true
        }
      }
    }).then(d => {
      console.log(d);
      this.setState({
        devices: d
      });
    }).catch(e => {
      console.error(e);
    })
  }

  deviceTemplate(device) {
    return device.name;
  }

  onDevicePicklistChange(event) {
    this.setState({
      devices: event.source,
      selectedDevices: event.target
    });
  }


  render() {
    if (this.props.step !== 2)
      return null;

    return (
      <Panel header="Select devices">
        <div className="p-grid">
          <div className="p-col-10 p-offset-1">
            <PickList
              sourceHeader="Available"
              targetHeader="Selected"
              source={this.state.devices}
              target={this.state.selectedDevices}
              showSourceControls={false}
              showTargetControls={false}
              itemTemplate={this.deviceTemplate}
              onChange={this.onDevicePicklistChange}
              responsive
            />
          </div>
          <div className="p-col-10 p-offset-1">
            <BackNext step={this.props.step}
              changeStep={this.props.changeStep}
              data={{ devices: this.state.selectedDevices }}
            />
          </div>
        </div>
      </Panel>
    );
  }
}

export default NewGroupStep3;