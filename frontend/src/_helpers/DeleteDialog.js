import React from 'react';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { AppSpinnerCenter } from '../components/AppSpinner';

export function DeleteDialog(props) {
  const { visible, onClose, onDelete, msg, isDeleting } = props;

  let diagContent, closeable = true, header = 'Confirm';


  if (isDeleting === false) {
    // deleted
    closeable = true;
    header = 'Deleted'
    diagContent = (
      <div className="p-grid">
        <div className="p-col-12">
          {msg}
        </div>
        <div className="p-col-12">
          <Button style={{ width: '100%' }} label="Ok" onClick={onClose} />
        </div>
      </div>
    );
  } else if (isDeleting === true) {
    // deleting
    closeable = false;
    header = 'Deleting...';
    diagContent = <AppSpinnerCenter />;
  } else {
    // confirm delete
    closeable = true;
    diagContent = (
      <div className="p-grid">
        <div className="p-col-12">
          {msg}
        </div>
        <div className="p-col-6">
          <Button style={{ width: '100%' }} label="delete" onClick={onDelete} />
        </div>
        <div className="p-col-6">
          <Button style={{ width: '100%' }} label="cancel" onClick={onClose} />
        </div>
      </div>
    );
  }

  return (
    <Dialog
      header={header}
      visible={visible}
      onHide={() => onClose()}
      style={{ width: '25vw' }}
      closable={closeable}
    >
      {diagContent}
    </Dialog>
  );
}