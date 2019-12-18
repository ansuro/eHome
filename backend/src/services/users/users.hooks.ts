import * as feathersAuthentication from '@feathersjs/authentication';
import * as local from '@feathersjs/authentication-local';
import isAdmin from '../../hooks/is-admin';
import noPaginate from '../../hooks/no-paginate';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = feathersAuthentication.hooks;
const { hashPassword, protect } = local.hooks;

export default {
  before: {
    all: [],
    find: [authenticate('jwt'), isAdmin(), noPaginate()],
    get: [authenticate('jwt')],
    create: [hashPassword('password'), isAdmin()],
    update: [ hashPassword('password'),  authenticate('jwt'), isAdmin() ],
    patch: [hashPassword('password'), authenticate('jwt'), isAdmin()],
    remove: [authenticate('jwt'), isAdmin()]
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
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
