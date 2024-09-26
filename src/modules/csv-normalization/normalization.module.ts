import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { NormalizationController } from './normalization.controller';
import { NormalizationService } from './normalization.service';
import { ClienteVehiculoModule } from '../client_vehicle/client-vehicle.module';

@Module({
  imports: [HttpModule, ClienteVehiculoModule],
  controllers: [NormalizationController],
  providers: [NormalizationService],
})
export class NormalizationModule {}