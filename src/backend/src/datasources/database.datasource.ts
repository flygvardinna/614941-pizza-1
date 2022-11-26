import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'pizza',
  connector: 'postgresql',
  url: 'postgres://pizza_zl04_user:fCiKgoioruGLYprQ8fsVFacgpoiHYd6C@dpg-ce11o1arrk09esb0on50-a/pizza_zl04',
  host: 'dpg-ce11o1arrk09esb0on50-a',
  port: 5432,
  user: 'pizza_zl04_user',
  password: 'fCiKgoioruGLYprQ8fsVFacgpoiHYd6C',
  database: 'pizza_zl04',
};

/* const config = {
  connector: 'postgresql',
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
}; */

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class DatabaseDataSource extends juggler.DataSource implements LifeCycleObserver {
  static dataSourceName = 'database';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.database', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
