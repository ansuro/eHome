import { Application } from "./declarations";
import logger from "./logger";
import { v4 } from "internal-ip";


export default async function (app: Application) {
  var mdns = require('mdns-server')({
    reuseAddr: true,
    loopback: true,
    noInit: true
  });

  const ip = await v4();
  // logger.info('%s', ip);

  mdns.on('query', function (query: any) {
    logger.info('%o', query);
    if (query.questions[0] && query.questions[0].name === 'ehome.local') {
      logger.info('ehome.local');
      mdns.respond({
        answers: [{ name: 'ehome.local', type: 'A', data: ip }]
      });
    }
  });

  // listen for errors
  mdns.on('error', function (error: any) {
    // do something here to handle the error if necessary
    console.log('mDNS Server Error', error.message);
  });

  mdns.initServer();
}
