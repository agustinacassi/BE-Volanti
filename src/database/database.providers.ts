import { DataSource } from 'typeorm';

//Database Connection
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