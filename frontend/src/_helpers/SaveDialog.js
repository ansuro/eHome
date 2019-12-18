import React from 'react';
import { withRouter } from 'react-router';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { AppSpinnerCenter } from '../components/AppSpinner';

class SaveDialog extends React.Component {
  constructor(props) {
    super(props);

    this.saveOk = this.saveOk.bind(this);
  }

  componentDidMount() {
    if(!this.props.returnURL) {
      console.error('returnURL must be provided');
    }
  }

  saveOk() {
    this.props.history.push(this.props.returnURL);
  }

  render() {
    let dialogContent;

    if (this.props.msg) {
      dialogContent = (
        <div className="p-grid">
          <div className="p-col-12">
            {this.props.msg}
          </div>
          <div className="p-col-12">
            <Button style={{ width: '100%' }} label="Ok" onClick={this.saveOk} />
          </div>
        </div>
      );
    } else {
      dialogContent = <AppSpinnerCenter />;
    }

    return (
      <Dialog
        header="Saving..."
        visible
        modal
        closable={false}
        style={{ width: '25vw' }}
        onHide={() => {}}
      >
        {dialogContent}
      </Dialog>
    );
  }
}

export default withRouter(SaveDialog);