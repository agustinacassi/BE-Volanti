import { DataSource } from 'typeorm';

/**
 * @constant
 * @name databaseProviders
 * @type {Array<Object>}
 * @description Proveedores de base de datos para la aplicación.
 */
export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'agustinacassi',
        password: 'agustinacassi',
        database: 'volanti',
        entities: [
            __dirname + '/../**/*.entity{.ts,.js}',
        ],
        synchronize: true,
        logging: true,
      });

      return dataSource.initialize();
    },
  },
];