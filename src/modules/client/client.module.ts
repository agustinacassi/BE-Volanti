import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { ClientService } from './client.service';
import { clientProviders } from './client.providers';
import { ClientController } from './client.controller';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...clientProviders,
    ClientService,
  ],
  controllers: [ClientController]
})
export class ClientModule {}