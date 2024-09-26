import { Controller, Post, Body, Headers, HttpException, HttpStatus } from '@nestjs/common';
import { NormalizationService } from './normalization.service';
import { ClienteVehiculoService } from '../client_vehicle/cliente-vehicle.service'; // Importa tu servicio para crear datos

@Controller('normalization')
export class NormalizationController {
  constructor(
    private readonly normalizationService: NormalizationService,
    private readonly clienteVehiculoService: ClienteVehiculoService,  // Inyecta tu servicio de clientes y vehículos
  ) {}

  @Post()
  async normalizeData(@Body() data: any[], @Headers('api-key') apiKey: string) {
    
    if (!apiKey) {
      throw new HttpException('API key is required', HttpStatus.UNAUTHORIZED);
    }

    try {
      // Normalizar los datos usando el servicio de normalización
      const normalizedData = await this.normalizationService.normalizeData(data, apiKey);

      // Guardar los datos normalizados en la base de datos usando clienteVehiculoService
      await this.clienteVehiculoService.createFromApi(normalizedData);  // Invoca el método de creación

      return { 
        success: true, 
        data: normalizedData 
      };
    } catch (error) {
      console.error('Error in normalizeData controller:', error);
      return { 
        success: false, 
        error: error.message || 'An unexpected error occurred'
      };
    }
  }
}
