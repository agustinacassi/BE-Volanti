import { DataSource } from 'typeorm';
import { Cliente } from './entities/client.entity';
import { Vehiculo } from './entities/vehicle.entity';
import { ClientesVehiculos } from './entities/client_vehicle.entity';

/**
 * @constant
 * @name repositoryProviders
 * @type {Array<{provide: string, useFactory: Function, inject: string[]}>}
 * @description Proveedores de repositorios para las entidades Cliente, Vehiculo y ClientesVehiculos.
 * Estos proveedores se utilizan para inyectar repositorios en los servicios y controladores de la aplicación.
 */
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