'use strict';

let Wit = null;
try {
  // if running from repo
  Wit = require('../').Wit;
} catch (e) {
  Wit = require('node-wit').Wit;
}

const accessToken = (() => {
  if (process.argv.length !== 3) {
    console.log('usage: node examples/quickstart.js <wit-access-token>');
    process.exit(1);
  }
  return process.argv[2];
})();

// Quickstart example
// See https://wit.ai/l5t/Quickstart

const firstEntityValue = (entities, entity) => {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value
  ;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};

const actions = {
  send(request, response) {
    console.log('sending...', JSON.stringify(response));
    return Promise.resolve();
  },
  merge({context, entities}) {
    // Retrieve the location entity and store it into a context field
    const loc = firstEntityValue(entities, 'location');
    if (loc) {
      context.loc = loc;
    }
    return Promise.resolve(context);
  },
  ['fetch-weather']({context}) {
    return new Promise(function(resolve, reject) {
      // Here should go the api call, e.g.:
      // context.forecast = apiCall(context.loc)
      context.forecast = 'sunny';
      return resolve(context);
    });
  },
};

const client = new Wit({accessToken, actions});
client.interactive();
