import React from 'react';

import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Dropdown } from 'primereact/dropdown';
import { Panel } from 'primereact/panel';
import { Message } from 'primereact/message';
import { BackNext } from '../../../_helpers/backnext';

import { Subject, from, combineLatest } from 'rxjs';
import { debounceTime, filter, map, tap, switchMap } from 'rxjs/operators';
import client from '../../../_helpers/fclient';



class NewUserStep1 extends React.Component {
  usernameInput$ = new Subject();
  pw1Input$ = new Subject();
  pw2Input$ = new Subject();
  sub;

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      password2: '',
      admin: false,
      usernameAvailable: true,
      usernameChecking: false,
      pwsEqual: true,
      pwLengthValid: true,
      editing: true
    };
  }

  componentDidMount() {
    const u1 = this.usernameInput$.pipe(
      tap(u => this.setState({ username: u, editing: true })),
      filter(value => value.length > 0),
      debounceTime(800),
      tap(() => this.setState({usernameChecking: true})),
      switchMap(username => this.usernameAvailable(username)),
      tap(u => this.setState({ usernameAvailable: u, usernameChecking: false }))
    );

    const p1 = this.pw1Input$.pipe(
      tap(p => this.setState({ password: p, editing: true }))
    );

    const p2 = this.pw2Input$.pipe(
      tap(p => this.setState({ password2: p, editing: true }))
    );

    const p1p2 = combineLatest(p1, p2).pipe(
      debounceTime(800),
      map(pws => pws[0] === pws[1]),
      tap(pu => {
        this.setState({
          pwsEqual: pu,
          pwLengthValid: this.state.password.length > 5 && this.state.password2.length > 5
        })
      })
    );

    this.sub = combineLatest(u1, p1p2).subscribe(v => {
      console.log('username available: ' + v[0]);
      console.log('passwords equal: ' + v[1]);
      console.log('password length valid: ' + this.state.pwLengthValid);
      this.setState({
        editing: false,
        formValid: v[0] && v[1] && this.state.pwLengthValid
      });
    });
  }

  componentDidUpdate() {
    console.log(this.state);
  }

  componentWillUnmount() {
    this.sub.unsubscribe();
  }

  async usernameAvailable(username) {
    const cu = await client.service('users').find({
      query: {
        $limit: 0,
        username: username
      }
    });
    return cu.total === 0;
  }

  render() {
    if (this.props.step !== 0)
      return null;

    const privileges = [
      { label: 'User', value: false },
      { label: 'Administrator', value: true }
    ];

    const { usernameAvailable, usernameChecking, username, pwsEqual, pwLengthValid, password2 } = this.state;
    const userEntered = username.length > 0;
    const pwEntered = password2.length > 0;
    let usernameMsg, pwMsg;

    if (userEntered) {
      if (usernameChecking) {
        usernameMsg = <i className="pi pi-spin pi-spinner" style={{ fontSize: '2em' }}></i>;
      } else if (!usernameAvailable) {
        usernameMsg = <Message severity="error" text="Username is already taken" />
      }
    }

    if (pwEntered) {
      if (!pwsEqual) {
        pwMsg = <Message severity="error" text="Passwords are not equal" />;
      } else if (!pwLengthValid) {
        pwMsg = <Message severity="error" text="Password must be at least 6 Characters long" />;
      }
    }

    return (
      <Panel header="User information">
        <div className="p-grid">
          <div className="p-col-10 p-offset-1">
            <div className="p-grid">
              <div className="p-col-12">
                <h3>Information</h3>
                <hr />
              </div>
              <div className="p-col-2">
                Username:
              </div>
              <div className="p-col-4">
                <InputText value={this.state.username} onChange={(e) => this.usernameInput$.next(e.target.value)} />
              </div>
              <div className="p-col-6">
                {usernameMsg}
              </div>
              <div className="p-col-2">
                Password:
              </div>
              <div className="p-col-4">
                <Password value={this.state.password} feedback={false} onChange={(e) => this.pw1Input$.next(e.target.value)} />
              </div>
              <div className="p-col-6">
              </div>
              <div className="p-col-2">
                Password (repeat):
              </div>
              <div className="p-col-4">
                <Password value={this.state.password2} feedback={false} onChange={(e) => this.pw2Input$.next(e.target.value)} />
              </div>
              <div className="p-col-6">
                {pwMsg}
              </div>
              <div className="p-col-12">
                <h3>Privilege</h3>
                <hr />
                <Dropdown options={privileges} value={this.state.admin} onChange={(e) => this.setState({ admin: e.value })} />
              </div>
            </div>
          </div>
          <div className="p-col-10 p-offset-1">
            <BackNext
              step={this.props.step}
              changeStep={this.props.changeStep}
              data={{ username: this.state.username, password: this.state.password, admin: this.state.admin }}
              nextDisabled={!this.state.formValid || this.state.editing}
            />
          </div>
        </div>
      </Panel>
    );
  }
}

export default NewUserStep1;