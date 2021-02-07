import React from 'react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { withRouter } from 'react-router';
import client from '../../../_helpers/fclient';



class DevicesTab extends React.Component {

  constructor(props) {
    super(props);

    // row format
    this.onlineTemplate = this.onlineTemplate.bind(this);
    this.statusTemplate = this.statusTemplate.bind(this);

    // paginator load method
    this.onPage = this.onPage.bind(this);

    // dropdown changed
    this.onOptionChanged = this.onOptionChanged.bind(this);

    this.state = {
      devices: {},
      newName: '',
      isLoading: true,
      ddOption: 'all',
      findQuery: {}
    };
  }

  componentDidMount() {
    this.findDevices();

    client.service('devices').on('patched', d => {
      this.setState((state, props) => {
        let { data, ...rest } = state.devices;
        data = state.devices.data.map((dx) => {
          if (dx._id === d._id) {
            return d;
          } else {
            return dx;
          }
        });
        return {
          devices: {
            data: data,
            ...rest
          }
        };
      });
    });
  }

  componentWillUnmount() {
    client.service('devices').off('patched');
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.findQuery !== this.state.findQuery) {
      this.findDevices();
    }
  }

  // TODO: on/off only; add values
  statusTemplate(rowData, column) {
    if (rowData.states === undefined)
      return 'unknown';

    return JSON.stringify(rowData.states);// ? 'on' : 'off';
  }

  onlineTemplate(rowData, column) {
    if (rowData.online === undefined)
      return;

    const c = rowData.online ? 'green' : 'red';
    return <i className="pi pi-wifi" style={{ color: c }}></i>
  }

  onPage(event) {
    this.setState(prevState => ({
      findQuery: {
        ...prevState.findQuery,
        $skip: event.first
      }
    }));
  }

  onOptionChanged(event) {
    if (event.value === 'all') {
      this.setState({
        ddOption: event.value,
        findQuery: {}
      });

      return;
    }

    let nameSet;
    if (event.value === 'c') {
      nameSet = true;
    } else if (event.value === 'uc') {
      nameSet = false;
    }

    this.setState({
      ddOption: event.value,
      findQuery: {
        name: {
          $exists: nameSet
        }
      }
    });
  }

  findDevices() {
    client.service('devices').find({
      query: this.state.findQuery
    }).then(d => {
      this.setState({
        devices: d
      });
      this.setState({ isLoading: false });
    }).catch(e => {
      console.error(e);
    });
  }

  showDeviceEditView(dev) {
    this.props.history.push('/management/devices/' + dev);
  }

  render() {
    const ddOptions = [
      { label: 'All', value: 'all' },
      { label: 'unconfigured', value: 'uc' },
      { label: 'configured', value: 'c' }
    ];

    return (
      <div className="p-grid p-dir-col">
        <Toast ref={(el) => this.growl = el} />
        <div className="p-col">
          <Dropdown value={this.state.ddOption} options={ddOptions} onChange={this.onOptionChanged} />
        </div>
        <div className="p-col">
          <DataTable
            emptyMessage="No Devices"
            value={this.state.devices.data}
            selectionMode="single"
            onSelectionChange={e => this.showDeviceEditView(e.value._id)}
            paginator
            onPage={this.onPage}
            totalRecords={this.state.devices.total}
            lazy
            rows={this.state.devices.limit}
            first={this.state.devices.skip}
            loading={this.state.isLoading}
            header={`Devices (${this.state.devices.total})`}
          >
            <Column field="name" header="Name"></Column>
            <Column field="MAC" header="MAC"></Column>
            <Column field="status" header="States" body={this.statusTemplate}></Column>
            <Column field="online" header="Connected" body={this.onlineTemplate} style={{ width: '8em', textAlign: 'center' }}></Column>
          </DataTable>
        </div>
      </div>
    );
  }
}

export default withRouter(DevicesTab);