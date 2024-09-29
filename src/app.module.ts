import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ClienteVehiculoModule } from './modules/client_vehicle/client-vehicle.module';
import { NormalizationModule } from './modules/csv-normalization/normalization.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule, ClienteVehiculoModule, NormalizationModule
  ],
})
export class AppModule {}