import * as authentication from '@feathersjs/authentication';
import * as local from '@feathersjs/authentication-local';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;
const { hashPassword, protect } = local.hooks;

export default {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [hashPassword('pw')],
    remove: []
  },

  after: {
    all: [
      protect('pw', 'password')
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
