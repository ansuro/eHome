import { createLogger, format, transports } from 'winston';


// Configure the Winston logger. For the complete documentation see https://github.com/winstonjs/winston

// let filename = module.filename;//.split('/').splice(-1);

const logger = createLogger({
  // To see more detailed errors, change this to 'debug'
  level: 'debug',
  format: format.combine(
    // format.label({label: module.filename, message: true}),
    format.splat(),
    format.simple(),
  ),
  transports: [
    // new transports.File({filename: 'backend.log'}),
    new transports.Console()
  ],
});

export default logger;
