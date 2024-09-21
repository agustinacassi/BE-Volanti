import { Controller, Post, Body } from '@nestjs/common';
import { ClienteVehiculoService } from './cliente-vehicle.service';
import { RelacionClienteVehiculoDTO } from './relation-client-vehicle.dto';

@Controller('cliente-vehiculo') 
export class ClienteVehiculoController {
  constructor(private readonly clienteVehiculoService: ClienteVehiculoService) {}

  @Post()
  async establecerRelacion(@Body() dto: RelacionClienteVehiculoDTO) {
    const relacion = await this.clienteVehiculoService.establecerRelacion(dto);
    return { 
      message: 'Relación cliente-vehículo creada exitosamente', 
      data: relacion 
    };
  }
}
