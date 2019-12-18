const {
  connect
} = require('mqtt');

exports.createDevice = function (MAC) {
  // const MAC = 'MACDEVICE1';
  let status = false;

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
      status = s.status;
      console.log(`New status: ${status ? 'on' : 'off'}`);
      // console.log(status.toString());
      pubStatus();
    }
  });

  console.log(`Device ${MAC} up and running. Status: ${status ? 'on' : 'off'}`);

  const pubStatus = () => {
    const m = {
      status: status,
      MAC: MAC
    };
    client.publish('status', Buffer.from(JSON.stringify(m)), {
      qos: 1
    });
  }
}