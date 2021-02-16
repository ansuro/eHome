import assert from 'assert';
import app from '../../src/app';

describe('\'password\' service', () => {
  it('registered the service', () => {
    const service = app.service('password');

    assert.ok(service, 'Registered the service');
  });
});
