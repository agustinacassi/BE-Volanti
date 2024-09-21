import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ClienteVehiculoController } from './client-vehicle.controller';
import { ClienteVehiculoService } from './cliente-vehicle.service';
import { repositoryProviders } from 'src/database/repository.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [ClienteVehiculoController],
  providers: [
    ...repositoryProviders,
    ClienteVehiculoService,
  ],
})
export class ClienteVehiculoModule {}