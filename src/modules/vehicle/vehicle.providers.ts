import { Vehiculo } from 'src/database/entities/vehicle.entity';
import { DataSource } from 'typeorm';

export const vehicleProviders = [
  {
    provide: 'VEHICLE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Vehiculo),
    inject: ['DATA_SOURCE'],
  },
];