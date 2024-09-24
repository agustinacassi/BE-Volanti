import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { NormalizationController } from './normalization.controller';
import { NormalizationService } from './normalization.service';

@Module({
  imports: [HttpModule],
  controllers: [NormalizationController],
  providers: [NormalizationService],
})
export class NormalizationModule {}