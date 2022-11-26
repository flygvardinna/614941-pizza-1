import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'database',
  connector: 'postgresql',
  url: 'postgres://ozzz:F0P2ShUn133R1W3j97x7F3BxNoBhp30V@dpg-ce11gmta4996ndslh0tg-a/pizza_hdrk',
  host: 'dpg-ce11gmta4996ndslh0tg-a',
  port: 5432,
  user: 'ozzz',
  password: 'F0P2ShUn133R1W3j97x7F3BxNoBhp30V',
  database: 'pizza_hdrk',
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
