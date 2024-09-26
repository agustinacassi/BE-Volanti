import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { repositoryProviders } from 'src/database/repository.providers';
import { ClienteVehiculoController } from './client-vehicle.controller';
import { ClienteVehiculoService } from './cliente-vehicle.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ClienteVehiculoController],
  providers: [
    ...repositoryProviders,
    ClienteVehiculoService,
  ],
  exports: [ClienteVehiculoService]
})
export class ClienteVehiculoModule {}