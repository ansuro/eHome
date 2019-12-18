import * as authentication from '@feathersjs/authentication';
import isAdmin from '../../hooks/is-admin';
import noPaginate from '../../hooks/no-paginate';
import adminEditMode from '../../hooks/admin-edit-mode';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

export default {
  before: {
    all: [authenticate('jwt')],
    find: [noPaginate(), adminEditMode()],
    get: [isAdmin()],
    create: [isAdmin()],
    update: [isAdmin()],
    patch: [isAdmin()],
    remove: [isAdmin()]
  },

  after: {
    all: [],
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
