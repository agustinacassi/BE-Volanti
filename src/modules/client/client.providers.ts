import { Cliente } from 'src/database/entities/client.entity';
import { DataSource } from 'typeorm';

export const clientProviders = [
  {
    provide: 'CLIENT_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Cliente),
    inject: ['DATA_SOURCE'],
  },
];