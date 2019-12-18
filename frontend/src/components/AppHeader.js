import React, { Component } from 'react';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';

class AppHeader extends Component {

    render() {
        return (
            <Toolbar>
                <div className="p-toolbar-group-left">
                    <Button icon="pi pi-bars" onClick={() => this.props.toggleMenu(true)} />
                </div>
                <div className="p-toolbar-group-right">
                    {/* <Button icon="pi pi-times" className="p-button-danger" /> */}
                </div>
            </Toolbar>
        );
    }
}

export default AppHeader;