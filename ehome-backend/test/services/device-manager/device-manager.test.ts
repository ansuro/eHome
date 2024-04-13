// For more information about this file see https://dove.feathersjs.com/guides/cli/service.test.html
import assert from 'assert';
import { logger } from '../../../src/logger';
import { app } from '../../../src/app';
import { IClientOptions, MqttClient, connect } from 'mqtt';
import { State, User } from '../../../src/client';

const deviceMAC = "0x1337";

const mqttOptions: IClientOptions = {
  clientId: deviceMAC,
  port: app.get('MQTT_PORT') || 1883,
  host: 'localhost',
  protocol: 'mqtt'
};

describe('devicemanager service', () => {
  let fakeDevice: MqttClient;
  let user: User;

  before(async () => {
    await app.listen(app.get('port'));
    user = await app.service('users').create({
      username: 'tester',
      password: 'test',
      isAdmin: false
    });
  });

  after(async () => {
    await app.service('users').remove(user.id);
    await app.service('devices').remove(null, {
      query: {
        MAC: deviceMAC
      }
    });
    fakeDevice.end();
    await app.service('states').remove(null, {
      query: {
        MAC: deviceMAC
      }
    });

    app.service('states').removeAllListeners('created');

    await app.teardown();
  });

  it('registered the service', () => {
    const service = app.service('device-manager');
    assert.ok(service, 'Registered the service');
  });

  it('a device can connect and subscribe to its mqtt topic', function (done) {
    fakeDevice = connect(mqttOptions);

    fakeDevice.on('connect', () => {
      logger.info('connected to mqttbroker');
      fakeDevice.subscribe(deviceMAC, (err, granted) => {
        if (err || granted === undefined) {
          assert.equal(granted, undefined);
          assert.fail(`unable to subscribe to mqtt topic ${deviceMAC}`);
        } else {
          assert.strictEqual(granted.length, 1, 'subscription failed');
          assert.strictEqual(granted[0].topic, deviceMAC, 'subscription failed');
        }

        // TODO check DB if device exists

        done();
      });
    });
  });

  it('a device can register itself and its states', function (done) {
    const deviceManager = app.service('device-manager');
    const stateService = app.service('states');
    assert.ok(deviceManager, 'deviceManager registered');
    assert.ok(stateService, 'service state registered');

    const states = [
      {
        name: 'Plug 1',
        value: false,
        type: 0
      },
      {
        name: 'Lamp 1',
        value: 'red',
        options: JSON.stringify(['red', 'blue', 'green']),
        type: 1
      },
      {
        name: 'Sensor 1',
        value: '21,5°',
        type: 2
      }
    ];

    let cStates = 0;
    // check if the different types has been saved correctly
    stateService.on('created', (data: State) => {
      logger.info('created state: %O', data);

      switch (data.type) {
        case 0:
          assert.strictEqual(data.name, states[0].name, 'name not saved correctly');
          // database value is string not boolean
          assert.strictEqual(data.value, 'false', 'value not saved correctly');
          cStates++;
          break;
        case 1:
          assert.strictEqual(data.options, states[1].options, 'options not saved correctly');
          assert.strictEqual(data.value, 'red', 'value not saved correctly');
          cStates++;
          break;
        case 2:
          assert.strictEqual(data.value, states[2].value, 'value not saved correctly');
          assert.strictEqual(data.name, states[2].name, 'name not saved correctly');
          cStates++;
          break;

        default:
          assert.fail('unknown state type');
      }

      // end the test after the three states
      if (cStates === 3) {
        done();
      }
    });

    fakeDevice.publish('register/' + deviceMAC, JSON.stringify(states), { qos: 2 }, (err) => {
      if (err) {
        assert.fail(`unable to publish to topic register/${deviceMAC}: ${err}`);
      }

      logger.info(`msg on topic "register/${deviceMAC}" sent.`);
    });

  });

  it('states can be read via state service', async () => {
    const stateService = app.service('states');
    assert.ok(stateService, 'service state registered');

    const states = await stateService.find({
      query: {
        MAC: deviceMAC
      }, paginate: false
    });

    assert.equal(states.length, 3, "there should be 3 states");

    for (let i = 0; i < states.length; i++) {
      const s = states[i];
      switch (s.type) {
        case 0:
          assert.equal(s.value, false, "value of type 0 device should be boolean not string");
          break;

        case 1:
          assert.equal(s.options, JSON.stringify(['red', 'blue', 'green']), 'options of type 1 devices are not equal');
          break;

        case 2:
          assert.equal(s.value, '21,5°', 'value of type 2 device is not equal');
          break;
      
        default:
          assert.fail('Unknown device type: ' + s.type);
      }
    }
  });

  it('a device state can be changed via mqtt', function (done) {
    const stateService = app.service('states');

    // check the result
    stateService.on('patched', (s: State) => {
      logger.info('patched: %o', s);
      assert.equal(s.value, '22,5°', 'changed state value not as expected.');

      done();
    });

    fakeDevice.publish('status/' + deviceMAC, JSON.stringify({
      name: 'Sensor 1',
      value: '22,5°',
      type: 2
    }), { qos: 2 }, (err) => {
      if (err) {
        assert.fail(`unable to publish to topic status/${deviceMAC}: ${err}`);
      }

      logger.info(`msg on topic "status/${deviceMAC}" sent.`);
    });
  });

});
