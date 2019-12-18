import React from "react";

import { Steps } from 'primereact/steps';

import NewGroupStep1 from './NewGroupStep1';
import NewGroupStep2 from './NewGroupStep2';
import NewGroupStep3 from './NewGroupStep3';
import NewGroupStep4 from './NewGroupStep4';

class NewGroupView extends React.Component {

  constructor(props) {
    super(props);

    this.onStepChange = this.onStepChange.bind(this);

    this.state = {
      activeStep: 0,
      data: {
        name: '',
        members: [],
        devices: []
      }
    };
  }

  onStepChange(event) {
    console.log(event);
    if (event.step === -1) {
      this.props.history.goBack();
    } else {
      this.setState(prevState => ({
        activeStep: event.step,
        data: {
          ...prevState.data,
          ...event.data
        }
      }));
    }
  }

  render() {
    const steps = [
      { label: 'Name' },
      { label: 'Members' },
      { label: 'Devices' },
      { label: 'Summary' }
    ];

    return (
      <div className="p-grid p-dir-col">
        <div className="p-col-8 p-offset-2">
          <Steps model={steps} activeIndex={this.state.activeStep} />
        </div>
        <div className="p-col-8 p-offset-2">
          <NewGroupStep1 changeStep={this.onStepChange} step={this.state.activeStep} />
        </div>
        <div className="p-col-8 p-offset-2">
          <NewGroupStep2 changeStep={this.onStepChange} step={this.state.activeStep} />
        </div>
        <div className="p-col-8 p-offset-2">
          <NewGroupStep3 changeStep={this.onStepChange} step={this.state.activeStep} />
        </div>
        <div className="p-col-8 p-offset-2">
          <NewGroupStep4 changeStep={this.onStepChange} step={this.state.activeStep} data={this.state.data} />
        </div>
      </div>
    );
  }
}

export default NewGroupView;