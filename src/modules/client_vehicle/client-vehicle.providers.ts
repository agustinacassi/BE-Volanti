
import { DataSource } from 'typeorm';
import { ClientesVehiculos } from 'src/database/entities/client_vehicle.entity';

export const clientVehicleProviders = [
  {
    provide: 'CLIENT_VEHICLE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(ClientesVehiculos),
    inject: ['DATA_SOURCE'],
  },
];
