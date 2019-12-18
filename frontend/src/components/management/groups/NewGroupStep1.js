import React from 'react';

import { InputText } from 'primereact/inputtext';
import { BackNext } from '../../../_helpers/backnext';
import { Panel } from 'primereact/panel';
import { Subject } from 'rxjs';
import { filter, tap, debounceTime, switchMap } from 'rxjs/operators';
import client from '../../../_helpers/fclient';
import { Message } from 'primereact/message';

class NewGroupStep1 extends React.Component {
  groupnameInput$ = new Subject();
  sub;

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      nameAvailable: true,
      nameChecking: false
    };
  }

  componentDidMount() {
    this.sub = this.groupnameInput$.pipe(
      tap(g => this.setState({ name: g })),
      filter(g => g.length > 0),
      debounceTime(800),
      tap(() => this.setState({ nameChecking: true })),
      switchMap(groupname => this.groupnameAvailable(groupname))
    ).subscribe(g => {
      this.setState({
        nameAvailable: g,
        nameChecking: false,
        formValid: g && this.state.name.length > 0
      });
    });
  }

  componentWillUnmount() {
    this.sub.unsubscribe();
  }

  async groupnameAvailable(groupname) {
    const a = await client.service('groups').find({
      query: {
        $limit: 0,
        name: groupname,
        $edit: true
      }
    });

    return a.total === 0;
  }

  render() {
    if (this.props.step !== 0)
      return null;

    const { nameChecking, nameAvailable, name } = this.state;
    let nameMsg;

    if (name.length > 0) {
      if (nameChecking) {
        nameMsg = <i className="pi pi-spin pi-spinner" style={{ fontSize: '2em' }}></i>;
      } else if (!nameAvailable) {
        nameMsg = <Message severity="error" text="Groupname is already taken" />
      }
    }

    return (
      <Panel header="Groupname">
        <div className="p-grid">
          <div className="p-col-10 p-offset-1">
            <div className="p-grid">
              <div className="p-col-2">
                Groupname:
              </div>
              <div className="p-col-4">
                <InputText id="groupname" value={this.state.name} onChange={(e) => this.groupnameInput$.next(e.target.value)} />
              </div>
              <div className="p-col-6">
                {nameMsg}
              </div>
            </div>
          </div>
          <div className="p-col-10 p-offset-1">
            <BackNext
              step={this.props.step}
              changeStep={this.props.changeStep}
              data={{ name: this.state.name }}
              nextDisabled={!this.state.formValid}
            />
          </div>
        </div>
      </Panel>
    );
  }
}

export default NewGroupStep1;