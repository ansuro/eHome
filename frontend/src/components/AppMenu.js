import React, { Component } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { NavLink } from 'react-router-dom';
import client from '../_helpers/fclient';

function MenuItem(props) {
    return (
        <div className="p-col">
            <NavLink onClick={props.close} to={props.to} exact activeClassName="activeMenuItem" className="menuItem">{props.label}</NavLink>
        </div>
    );
}

function MenuCloseItem(props) {
    return (
        <div className="p-col" onClick={props.close}>
            <div className="menuCloseItem menuActionItem">
                <span className="pi pi-angle-double-left" />
            </div>
        </div>
    );
}

function MenuActionItem(props) {
    return (
        <div className="p-col" onClick={props.action}>
            <div className="menuActionItem">{props.label}</div>
        </div>
    );
}

class AppMenu extends Component {

    constructor(props) {
        super(props);
        this.close = this.close.bind(this);
        this.logout = this.logout.bind(this);

    }

    close() {
        this.props.toggleMenu(false);
    }

    logout() {
        client.logout().finally(() => {
            window.location.href = '/';
        });
    }

    render() {
        return (
            <Sidebar id="sbar" visible={this.props.menuopen} position="left" baseZIndex={1000000} onHide={(e) => this.close} showCloseIcon={false}>
                <div className="p-grid p-dir-col p-nogutter">
                    <MenuCloseItem close={this.close} />
                    <MenuItem to="/" label="Frontpage" close={this.close} />
                    <MenuItem to="/devices" label="Devices" close={this.close} />
                    {this.props.admin && <MenuItem to="/management" label="Management" close={this.close} />}
                    <MenuItem to="/settings" label="Settings" close={this.close} />
                    <MenuActionItem label="Logout" action={this.logout} />
                </div>
            </Sidebar>
        );
    }
}

export default AppMenu;