const {
  connect
} = require('mqtt');
const { env } = require('process');

const BROKER_URL = 'mqtt://api.ansuro.me';

exports.createDevice = function (MAC) {
  let status = [{
    name: 'Plug 1',
    value: true,
    type: 0
  }, {
    name: 'Thermo1',
    value: '18.42°',
    type: 2
  }, {
    name: 'Lamp1',
    value: 'red',
    options: ['red', 'green', 'blue'],
    type: 1
  }];

  let client;
  let msg2send = '';

  if (env.NODE_ENV === 'prod' || 'production') {
    client = connect(BROKER_URL, {
      clientId: MAC
    });
  } else {
    client = connect({
      clientId: MAC
    });
  }

  client.on('connect', () => {
    client.subscribe(MAC, () => {
      console.log('Subscribed to: ' + MAC);
    });
    pubStatus();
  });

  client.on('message', (topic, message) => {
    if (topic === MAC) {
      const s = JSON.parse(message.toString());
      console.log('Incoming msg: ');
      console.log(s);
      // TODO array patchen nicht überschreiben
      // status.filter((s, i) => s.name === status.name).map((s, i) => {
      //   status[i].value = s.value;
      // });
      status.forEach((e, i) => {
        if (s.name === e.name) {
          status[i].value = s.value;
          console.log('State found and set: ');
          console.log(status[i]);
          msg2send = status[i];
        }
      });

      // console.log(status.toString());
      // setTimeout(pubStatus, 5000);
      pubStatus();
    }
  });

  console.log(`Device ${MAC} up and running. Status: ${JSON.stringify(status)}`);

  const pubStatus = () => {
    console.log(JSON.stringify(status));
    // client.publish('status/' + MAC, Buffer.from(JSON.stringify(status)), {
    //   qos: 1
    // });
    client.publish('status/' + MAC, Buffer.from(JSON.stringify(msg2send)), {
      qos: 1
    });
  }
}