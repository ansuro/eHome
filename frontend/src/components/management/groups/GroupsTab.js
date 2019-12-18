import React from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { withRouter } from 'react-router';
import client from '../../../_helpers/fclient';
import { DeleteDialog } from '../../../_helpers/DeleteDialog';


class GroupsTab extends React.Component {

  constructor(props) {
    super(props)

    this.onPage = this.onPage.bind(this);
    this.actionsTemplate = this.actionsTemplate.bind(this);

    this.state = {
      groups: [],
      isLoading: true,
      delDiagVisible: false,
      findQuery: {
        $edit: true
      }
    };
  }

  componentDidMount() {
    this.findGroups();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.findQuery !== this.state.findQuery) {
      this.findGroups();
    }
  }

  async findGroups() {
    let groups = await client.service('groups').find({
      query: this.state.findQuery
    });

    await Promise.all(
      groups.data.map(async g => {
        const { devices, members } = g;
        g.devices = await client.service('devices').find({
          query: {
            $paginate: false,
            $select: ['_id', 'name'],
            _id: {
              $in: devices
            }
          }
        });
        g.members = await client.service('users').find({
          query: {
            $paginate: false,
            $select: ['_id', 'username'],
            _id: {
              $in: members
            }
          }
        });
      })
    );
    console.log('groups');
    console.log(groups);
    this.setState({
      groups: groups,
      isLoading: false
    });
  }

  showEditGroupView(id) {
    // console.log(group);
    this.props.history.push('/management/groups/' + id);
  }

  showDeleteDialog(group) {
    console.log(group);
    const { _id, name } = group;
    this.setState({
      delId: _id,
      delName: name,
      delMsg: `Delete group "${name}"?`,
      isDeleting: null,
      delDiagVisible: true
    });
  }

  async deleteGroup() {
    const id = this.state.delId;
    this.setState({
      isDeleting: true
    });
    try {
      await client.service('groups').remove(id);
      this.setState({
        isDeleting: false,
        delMsg: `Group "${this.state.delName}" deleted.`
      });
      await this.findGroups();
    } catch (e) {
      this.setState({
        isDeleting: false,
        delMsg: `Error: ${e}`
      });
    }
  }

  devicesTemplate(rowData, column) {
    return rowData.devices.map(d => d.name).join(', ');
    // return (
    //   <ul>
    //     {rowData.devices.map(d => <li key={d._id}>{d.name}</li>)}
    //   </ul>
    // );
  }

  membersTemplate(rowData, column) {
    return rowData.members.map(m => m.username).join(', ');
    // return (
    //   <ul>
    //     {rowData.members.map(m => <li key={m._id}>{m.username}</li>)}
    //   </ul>
    // );
  }

  actionsTemplate(rowData, column) {
    return (
      <>
        <Button icon="pi pi-pencil" className="p-button-secondary" style={{ marginRight: '.5em' }} onClick={() => this.showEditGroupView(rowData._id)} />
        <Button icon="pi pi-minus-circle" className="p-button-secondary" onClick={() => this.showDeleteDialog(rowData)} />
      </>
    );
  }

  onPage(event) {
    this.setState(prevState => ({
      findQuery: {
        ...prevState.findQuery,
        $skip: event.first
      }
    }));
  }

  render() {
    return (
      <div className="p-grid p-dir-col">
        {/* <div className="p-col-12">Desc</div> */}
        <div className="p-col-12">
          <Button label="New group" icon="pi pi-plus-circle" onClick={() => this.props.history.push('/management/groups/new')}></Button>
        </div>
        <div className="p-col-12">
          <DataTable
            emptyMessage="No groups defined"
            header={`Groups (${this.state.groups.total})`}
            value={this.state.groups.data}
            lazy
            loading={this.state.isLoading}
            paginator
            rows={this.state.groups.limit}
            first={this.state.groups.skip}
            onPage={this.onPage}
          >
            <Column field="name" header="Name"></Column>
            <Column field="members" header="Members" body={this.membersTemplate}></Column>
            <Column field="devices" header="Devices" body={this.devicesTemplate}></Column>
            <Column body={this.actionsTemplate} style={{ width: '8em', textAlign: 'center' }}></Column>
          </DataTable>
        </div>
        <DeleteDialog
          onDelete={() => this.deleteGroup()}
          onClose={() => this.setState({ delDiagVisible: false })}
          visible={this.state.delDiagVisible}
          msg={this.state.delMsg}
          isDeleting={this.state.isDeleting}
        />
      </div>
    );
  }
}

export default withRouter(GroupsTab);