import { Application } from "./declarations";
import logger from "./logger";


export default async function (app: Application) {
  var mdns = require('mdns-server')({
    reuseAddr: true,
    loopback: true,
    noInit: true
  });


  mdns.on('query', function(query: any) {
    logger.info('%o', query);
    // logger.info('query');
    if (query.questions[0] && query.questions[0].name === 'ehome.local') {
      // mdns.respond(someResponse) // see below
      logger.info('ehome.local');
      // mdns.respond({
      //   answers: [{name:'ehome.local', type:'A', data:'192.158.1.5'}]
      // });
    }
  });

  // listen for errors
  mdns.on('error', function (error: any) {
    // do something here to handle the error if necessary
    console.log('mDNS Server Error', error.message);
  });

  mdns.initServer();
}
