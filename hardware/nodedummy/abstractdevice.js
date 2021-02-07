const {
  connect
} = require('mqtt');

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

  const client = connect({
    clientId: MAC
  });

  client.on('connect', () => {
    client.subscribe(MAC, () => {
      console.log('Subscribed to: ' + MAC);
    });
    pubStatus();
  });

  client.on('message', (topic, message) => {
    if (topic === MAC) {
      const s = JSON.parse(message.toString());
      // TODO array patchen nicht überschreiben
      status = s.status;
      // console.log(`New status: ${status ? 'on' : 'off'}`);
      console.log(status.toString());
      pubStatus();
    }
  });

  console.log(`Device ${MAC} up and running. Status: ${JSON.stringify(status)}`);

  const pubStatus = () => {
    // const m = {
    //   states: status
    // };
    console.log(JSON.stringify(status));
    client.publish('status/' + MAC, Buffer.from(JSON.stringify(status)), {
      qos: 1
    });
  }
}