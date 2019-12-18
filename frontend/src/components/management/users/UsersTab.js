import React from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { withRouter } from 'react-router';
import client from '../../../_helpers/fclient';
import { DeleteDialog } from '../../../_helpers/DeleteDialog';




class UsersTab extends React.Component {

  constructor(props) {
    super(props);

    // paginator load method
    this.onPage = this.onPage.bind(this);

    this.actionsTemplate = this.actionsTemplate.bind(this);

    this.state = {
      users: [],
      isLoading: false,
      userEditViewVisible: false,
      newUserViewVisible: false,
      findQuery: {
      }
    };

  }

  async componentDidMount() {
    console.log('did mount');
    await this.findUsers();

    client.service('users').on('patched', d => {
      this.setState((state, props) => {
        let { data, ...rest } = state.users;
        data = state.users.data.map((dx) => {
          if (dx._id === d._id) {
            return d;
          } else {
            return dx;
          }
        });
        return {
          users: {
            data: data,
            ...rest
          }
        };
      });
    });
  }

  componentWillUnmount() {
    client.service('users').off('patched');
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevState.findQuery !== this.state.findQuery) {
      await this.findUsers();
    }
  }

  async findUsers() {
    this.setState({ isLoading: true });
    const users = await client.service('users').find({
      query: this.state.findQuery
    });

    await Promise.all(
      users.data.map(async u => {
        u.groups = await client.service('groups').find({
          query: {
            $paginate: false,
            $edit: true,
            $select: ['_id', 'name'],
            members: u._id
          }
        });
      })
    );
    this.setState({
      users: users,
      isLoading: false
    });
  }

  adminTemplate(rowData, column) {
    return rowData.admin ? <i className="pi pi-check" style={{ color: 'green' }}></i> : <i className="pi pi-minus" style={{ color: 'red' }}></i>;
  }

  groupsTemplate(rowData, column) {
    return rowData.groups.map(g => g.name).join(', ');
  }

  showUserEditView(user) {
    console.log(user);
    this.props.history.push('/management/users/' + user);
  }

  showDeleteDialog(user) {
    console.log(user);
    const { _id, username } = user;
    this.setState({
      delId: _id,
      delName: username,
      delMsg: `Delete user "${username}"?`,
      isDeleting: null,
      delDiagVisible: true
    });
  }

  async deleteUser() {
    const id = this.state.delId;
    this.setState({
      isDeleting: true
    });
    try {
      await client.service('users').remove(id);
      await client.service('groups').patch(null, {
        $pull: {
          members: id
        }
      });
      this.setState({
        isDeleting: false,
        delMsg: `User "${this.state.delName}" deleted.`
      });
      await this.findUsers();
    } catch (e) {
      this.setState({
        isDeleting: false,
        delMsg: `Error: ${e}`
      });
    }
  }

  actionsTemplate(rowData, column) {
    console.log(rowData);
    return (
      <>
        <Button icon="pi pi-pencil" className="p-button-secondary" style={{ marginRight: '.5em' }} onClick={() => this.showUserEditView(rowData._id)} />
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
      <div className="p-grid p-dir-col" >
        <div className="p-col">
          <Button label="New User" icon="pi pi-user-plus" onClick={() => this.props.history.push('/management/users/new')}></Button>
        </div>
        <div className="p-col">
          <DataTable
            value={this.state.users.data}
            loading={this.state.isLoading}
            lazy
            paginator
            rows={this.state.users.limit}
            first={this.state.users.skip}
            totalRecords={this.state.users.total}
            onPage={this.onPage}
            header={`Users (${this.state.users.total})`}
          >
            <Column field="username" header="Username"></Column>
            <Column field="groups" header="Groups" body={this.groupsTemplate}></Column>
            <Column field="admin" header="Admin" body={this.adminTemplate} style={{ width: '8em', textAlign: 'center' }}></Column>
            <Column body={this.actionsTemplate} style={{ width: '8em', textAlign: 'center' }}></Column>
          </DataTable>
        </div>
        <DeleteDialog
          onDelete= {() => this.deleteUser()}
          onClose={() => this.setState({delDiagVisible: false})}
          visible={this.state.delDiagVisible}
          msg={this.state.delMsg}
          isDeleting={this.state.isDeleting}
        />
      </div>
    );
  }
}

export default withRouter(UsersTab);