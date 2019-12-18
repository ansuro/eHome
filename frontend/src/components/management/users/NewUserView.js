import React from 'react';

import { Steps } from 'primereact/steps';

import NewUserStep1 from './NewUserStep1';
import NewUserStep2 from './NewUserStep2';
import NewUserStep3 from './NewUserStep3';
import { Button } from 'primereact/button';

class NewUserView extends React.Component {

  constructor(props) {
    super(props);

    this.onStepChange = this.onStepChange.bind(this);
    this.test = this.test.bind(this);

    this.state = {
      activeStep: 0,
      data: {
        username: '',
        password: '',
        admin: false,
        groups: []
      }
    };
  }

  test() {
    console.log(this.state);
  }

  onStepChange(event) {
    console.log(event);
    if (event.step === -1) {
      // this.props.cancel();
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
      { label: 'User information' },
      { label: 'Groups' },
      { label: 'Summary' }
    ];

    return (
      <div className="p-grid p-dir-col">
        <div className="p-col-8 p-offset-2">
          <Steps model={steps} activeIndex={this.state.activeStep} />
        </div>
        <div className="p-col-8 p-offset-2">
          <NewUserStep1 changeStep={this.onStepChange} step={this.state.activeStep} />
        </div>
        <div className="p-col-8 p-offset-2">
          <NewUserStep2 changeStep={this.onStepChange} step={this.state.activeStep} />
        </div>
        <div className="p-col-8 p-offset-2">
          <NewUserStep3 history={this.props.history} changeStep={this.onStepChange} step={this.state.activeStep} data={this.state.data} />
        </div>
      </div>
    );
  }
}

export default NewUserView;