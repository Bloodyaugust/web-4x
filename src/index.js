import bodyParser from 'body-parser';
import chance from 'chance';
import express from 'express';
import { inspect } from 'util';
import { getSheet } from './lib/castledb-interface.js';

const expressApp = express();
expressApp.use(bodyParser.json());

global.chance = new chance();

function update() {
  // console.time('systems');
  console.log('Run systems here');
  // console.timeEnd('systems');
  setTimeout(update, 1000);
}

update();

expressApp.get('/hello', (request, response) => {
  console.log('Generating hello response...');

  response.send('hello!');
});

expressApp.listen(3000, () => {
  console.log(`Server started at ${new Date}`);
});
