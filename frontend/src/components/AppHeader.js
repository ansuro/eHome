import React, { Component } from 'react';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';

class AppHeader extends Component {
    render() {

        const left = <Button icon="pi pi-bars" onClick={() => this.props.toggleMenu(true)} />;
        
        return (
            <Toolbar left={left} />
        );
    }
}

export default AppHeader;