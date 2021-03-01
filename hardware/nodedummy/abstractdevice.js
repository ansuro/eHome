const {
  connect
} = require('mqtt');
const { env } = require('process');
const fs = require('fs');

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

  let msg2send = '';

  if (env.NODE_ENV === 'prod' || 'production') {
      mqttOptions = {
        clientId: MAC,
        key: fs.readFileSync('../../../cert/key_1024.pem'),
        cert: fs.readFileSync('../../../cert/x509_1024.pem'),
        port: 8883,
        host: 'api.ansuro.me',
        protocol: 'mqtts',
        rejectUnauthorized: false
      };
  } else {
    mqttOptions = {
      clientId: MAC,
      port: 1883,
      host: 'localhost',
      protocol: 'mqtt'
    };
  }

  const client = connect(mqttOptions);
  
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