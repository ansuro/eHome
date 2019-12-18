import React, { Component } from 'react';
import client from '../_helpers/fclient';

import { InputSwitch } from 'primereact/inputswitch';
import { Dropdown } from 'primereact/dropdown';
import { Panel } from 'primereact/panel';
import { AppSpinner } from './AppSpinner';
import { from } from 'rxjs';
import { tap, map, reduce, flatMap, concatMap, distinct, toArray } from 'rxjs/operators';

class DeviceState extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isChanging: false
    };

    console.log('props');
    console.log(props);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.status.value !== this.props.status.value) {
      this.setState({
        isChanging: false
      });
    }
  }

  onSwitch() {
    const { name, value } = this.props.status;
    const st = {
      name: name,
      value: !value
    };
    this.setState({
      isChanging: true
    });
    this.props.onChange(st)
  }

  render() {
    const { name, type, value } = this.props.status;

    const { isChanging } = this.state;
    // const bValue = value === 'true' ? true : false;
    // const stateChange = {
    //   value: !bValue,
    //   name: name
    // };
    // console.log(typeof value);
    const s = isChanging && <i className="pi pi-spin pi-spinner"></i>;

    const ds = <>
      <div className="p-col-6">{name}</div>
      <div className="p-col-3"><InputSwitch disabled={isChanging} checked={value} onChange={() => this.onSwitch()} /></div>
      <div className="p-col-3">{s}</div>
    </>;
    return ds;
  }
}

class Device extends Component {

  constructor(props) {
    super(props);

    this.onChangeStatus = this.onChangeStatus.bind(this);

    this.state = {
      isChanging: false
    };
  }

  // TODO check again
  async onChangeStatus(e) {
    console.log(e);
    console.log(e.value);
    console.log(e.name);
    const did = this.props.device._id;
    // this.setState({
    //   isChanging: true
    // });
    // let states = this.props.device.states;

    // let newStates = states.map((sx) => {
    //   if(sx.name === e.name) {
    //     return {
    //       ...sx,
    //       value: e.value
    //     };
    //   } else {
    //     return sx;
    //   }
    // });

    // console.log(newStates);

    const st = await client.service('devicemanager').patch(did, {
      name: e.name,
      value: e.value
    });
  }

  // componentDidUpdate(prevProps) {
  //   if (prevProps.device.status !== this.props.device.status) {
  //     this.setState({
  //       isChanging: false
  //     });
  //   }
  // }

  render() {
    const { name, online, states } = this.props.device;

    const w = <i className="pi pi-wifi" style={{ color: online ? 'green' : 'red', float: 'right' }}></i>;
    console.log(this.props.device);
    // const disabled = !online || isChanging;
    // const checked = status === 'on' ? true : false;
    console.log(states);
    const header = <span>{name}{w}</span>;
    return (
      <div className="p-col-12 p-md-3">
        <Panel header={header} style={{ textAlign: 'center' }}>
          <div className="p-grid">
            {
              states.map(s => <DeviceState key={s.name} status={s} onChange={(s) => this.onChangeStatus(s)} />)
            }
          </div>
          {/* <InputSwitch disabled={disabled} checked={checked} onChange={this.onChangeStatus} /> */}
        </Panel>
      </div>
    );
  }
}

class Devices extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      devices: [],
      groups: [],
      selGroup: ''
    };
  }

  async componentDidMount() {
    const groups = await client.service('groups').find({
      query: {
        $paginate: false
      }
    });

    from(groups).pipe(
      flatMap(g => g.devices),
      distinct(g => g._id),
      toArray(),
      // tap(g => console.log(g))
    ).subscribe(d => {
      this.setState({
        devices: d,
        groups: groups,
        isLoading: false
      });
    });

    client.service('devices').on('patched', d => {
      console.log(d);
      this.setState((state, props) => {
        const devices = state.devices.map((dx) => {
          if (dx._id === d._id) {
            return d;
          } else {
            return dx;
          }
        });

        return { devices };
      });
    });
  }

  componentWillUnmount() {
    client.service('devices').off('patched');
  }

  onChange(group) {
    console.log(group);
    this.setState({
      selGroup: group,
      devices: group.devices
    });
  }

  render() {
    if (this.state.isLoading)
      return <AppSpinner />;

    return (
      <div className="p-grid">
        <div className="p-col-12">
          <Dropdown value={this.state.selGroup} optionLabel="name" options={this.state.groups} onChange={e => this.onChange(e.value)} placeholder="Showing all devices" />
        </div>
        <div className="p-col-12">
          <div className="p-grid">
            {
              this.state.devices.map(d => <Device key={d._id} device={d} />)
            }
          </div>
        </div>
      </div>
    );
  }
}

export default Devices;