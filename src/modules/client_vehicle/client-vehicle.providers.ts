import { ClientesVehiculos } from 'src/database/entities/client_vehicle.entity';
import { DataSource } from 'typeorm';


export const clientesVehiculosProviders = [
  {
    provide: 'CLIENTES_VEHICULOS_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(ClientesVehiculos),
    inject: ['DATA_SOURCE'],
  },
];