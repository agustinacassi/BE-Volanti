import { Module } from '@nestjs/common';
import { ClientModule } from './modules/client/client.module';
import { DatabaseModule } from './database/database.module';
import { VehicleModule } from './modules/vehicle/vehicle.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [DatabaseModule, ClientModule, VehicleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}