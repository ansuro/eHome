import React from 'react';

import { Button } from 'primereact/button';

export function BackNext(props) {
  const backLabel = props.backLabel;
  const nextLabel = props.nextLabel;
  const nextDisabled = props.nextDisabled;
  const data = props.data;
  const changeStep = props.changeStep;
  const step = props.step;

  const func = props.onClick ? props.onClick : () => changeStep({ step: step + 1, data: data });

  return (
    <div className="p-grid">
      <div className="p-col-2">
        <Button
          label={backLabel ? backLabel : step === 0 ? 'cancel' : 'back'}
          onClick={() => changeStep({ step: step - 1 })}
          style={{ width: '100%' }}
          className="p-button-secondary"
        />
      </div>
      <div className="p-col-2 p-offset-8">
        <Button
          label={nextLabel ? nextLabel : 'next'}
          // onClick={() => changeStep({ step: step + 1, data: data })}
          onClick={func}
          style={{ width: '100%' }}
          disabled={nextDisabled}
        />
      </div>
    </div>
  );
}