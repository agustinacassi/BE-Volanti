import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { NormalizationService } from './normalization.service';
import { ClienteVehiculoService } from '../client_vehicle/cliente-vehicle.service';

@Controller('normalization')
export class NormalizationController {
  constructor(
    private readonly normalizationService: NormalizationService,
    private readonly clienteVehiculoService: ClienteVehiculoService,
  ) {}

  @Post()
  async normalization(@Body() body: { data }) {
    try {
      const normalizedData = await this.normalizationService.normalizeData(body);
      await this.clienteVehiculoService.createNormalizedFromCSV(normalizedData);
      return { success: true, message: 'Data normalized and saved successfully' };
    } catch (error) {
      console.error('Error in normalizeData controller:', error);
    }
  }
}