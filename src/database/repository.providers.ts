import { DataSource } from 'typeorm';
import { Cliente } from 'src/database/entities/client.entity';
import { Vehiculo } from 'src/database/entities/vehicle.entity';
import { ClientesVehiculos } from 'src/database/entities/client_vehicle.entity';

export const repositoryProviders = [
  {
    provide: 'CLIENTE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Cliente),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'VEHICULO_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Vehiculo),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'CLIENTES_VEHICULOS_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(ClientesVehiculos),
    inject: ['DATA_SOURCE'],
  },
];