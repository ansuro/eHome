import assert from 'assert';
import app from '../../src/app';

describe('\'DeviceManager\' service', () => {
  it('registered the service', () => {
    const service = app.service('devicemanager');

    assert.ok(service, 'Registered the service');
  });
});
