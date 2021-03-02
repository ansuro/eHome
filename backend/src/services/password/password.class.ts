import { BadRequest, Forbidden } from '@feathersjs/errors';
import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import logger from '../../logger';

interface Data {
  [pw: string]: any;
}

interface ServiceOptions { }

export class Password implements ServiceMethods<Data> {
  app: Application;
  options: ServiceOptions;

  constructor(options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async find(params?: Params): Promise<Data[] | Paginated<Data>> {
    throw new Forbidden();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async get(id: Id, params?: Params): Promise<Data> {
    throw new Forbidden();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(data: Data, params?: Params): Promise<Data> {
    throw new Forbidden();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update(id: NullableId, data: Data, params?: Params): Promise<Data> {
    throw new Forbidden();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async patch(id: NullableId, data: Data, params?: Params): Promise<Data> {
    // logger.info('change pw: data: %o, Params: %o', data, params);

    if (!params || !params.user) {
      return new BadRequest();
    }
    const userId = params.user._id;
    const pw = data.pw;

    logger.info('user id: %s, pw: %s', userId, pw);

    try {
      await this.app.service('users')._patch(userId, { password: pw });
    } catch (e) {
      logger.error('password change failed: %e', e);
    }
    return data;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async remove(id: NullableId, params?: Params): Promise<Data> {
    throw new Forbidden();
  }
}
