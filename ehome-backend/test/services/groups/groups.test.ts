// For more information about this file see https://dove.feathersjs.com/guides/cli/service.test.html
import assert from 'assert'
import { app } from '../../../src/app'
import io from 'socket.io-client'
import socketio from '@feathersjs/socketio-client'
import { ClientApplication, Device, Group, Membership, State, User, UserData, createClient } from '../../../src/client';
import { logger } from '../../../src/logger';

describe('groups service', () => {

  const deviceMAC = "0x1338";
  let group: Group;
  let state: State;
  let device: Device;
  let user1: User;
  let adminUser: User;
  let membership: Membership;

  const userData: UserData = {
    username: 'user',
    // password: 'supersecret',
    isAdmin: false
  }

  let client: ClientApplication;// = createClient(socketio(io('http://localhost:8995')));

  before(async () => {
    await app.listen(app.get('port'));
    client = createClient(socketio(io('http://localhost:8995')));
  });

  after(async () => {
    await app.service('devices').remove(null, {
      query: {
        MAC: deviceMAC
      }
    });

    await app.service('states').remove(null, {
      query: {
        MAC: deviceMAC
      }
    });

    await app.service('groups').remove(group.id);
    await app.service('users').remove(user1.id);
    await app.service('users').remove(adminUser.id);
    await app.service('membership').remove(membership.id);

    // const a = await client.logout();
    // logger.info('%o', a);
    await app.teardown();
  });

  it('registered the service and created device, state, group', async () => {
    const devicesService = app.service('devices');
    const groupsService = app.service('groups');
    const statesService = app.service('states');

    assert.ok(devicesService, 'Registered the devicesService');
    assert.ok(groupsService, 'Registered the groupsService');
    assert.ok(statesService, 'Registered the stateService');

    device = await devicesService.create({
      MAC: deviceMAC,
      name: 'Device',
      isOnline: true
    });

    state = await statesService.create({
      MAC: deviceMAC,
      name: 'State',
      type: 0,
      value: true
    });

    group = await groupsService.create({
      name: 'Group',
      devices: ''
    });
  });

  it('added the device to the group', async () => {
    group = await app.service('groups').patch(group.id, {
      devices: JSON.stringify([device.MAC])
    });

    const d = JSON.parse(group.devices);
    // logger.info("%o", d);
    const a = [deviceMAC];
    // logger.info('%o', a);

    assert.deepEqual(d, a, 'member not saved correctly');
  });

  it('added the user to the group', async () => {
    user1 = await app.service('users').create({
      username: 'benutzer',
      isAdmin: false
    });

    let dbUser = await app.service('users').get(user1.id);
    assert.deepEqual(user1, dbUser, 'user not saved correctly');

    adminUser = await app.service('users').create({
      username: 'admin2',
      isAdmin: true
    });

    dbUser = await app.service('users').get(adminUser.id);
    assert.deepEqual(adminUser, dbUser, 'admin user not saved correctly');

    membership = await app.service('membership').create({
      uid: user1.id,
      gid: group.id
    })

    // logger.info('%o', membership);

    // try {
    //   const { user, accessToken } = await client.authenticate({
    //     strategy: 'local',
    //     ...userData
    //   })
    // } catch (e) {
    //   logger.error(e);
    // }
  });

  it('user can get its groups and associated devices', async () => {
    const userGroups = await app.service('groups').find({
      user: user1,
      paginate: false
    });

    // logger.info("UG %o", userGroups);
    // logger.info("G %o", group);
    assert.deepEqual(group, userGroups[0], 'groups dont match');
  });

  it('admin can get all groups and associated devices', async () => {
    const allGroups = await app.service('groups').find({
      user: adminUser,
      paginate: false,
      query: {
        // optional query property to find all groups (admin only)
        findAll: true
      }
    });

    assert.deepEqual(group, allGroups[0], 'admin find all groups dont match');

  });

})
