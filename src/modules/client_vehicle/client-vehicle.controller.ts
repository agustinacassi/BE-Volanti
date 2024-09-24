import { Controller, Post, Body, Get } from '@nestjs/common';
import { ClienteVehiculoService } from './cliente-vehicle.service';

@Controller('cliente-vehiculo') 
export class ClienteVehiculoController {
  constructor(private readonly clienteVehiculoService: ClienteVehiculoService) {}

  @Post()
  async establecerRelacion(@Body() dto) {
    const relacion = await this.clienteVehiculoService.establecerRelacion(dto);
    return { 
      message: 'Relación cliente-vehículo creada exitosamente', 
      data: relacion 
    };
  }

  @Get()
  async obtenerRelaciones() {
    const clientes = await this.clienteVehiculoService.obtenerTodasLasRelaciones();
    return clientes.map(cliente => ({
      id: cliente.id,
      name: cliente.name,
      alias: cliente.alias,
      gender: cliente.gender,
      country: cliente.country,
      phone: cliente.phone,
      is_company: cliente.is_company,
      vehiculos: cliente.clientesVehiculos.map(cv => ({
        id: cv.vehiculo.id,
        brand: cv.vehiculo.brand,
        model: cv.vehiculo.model,
        plate: cv.vehiculo.plate
      }))
    }));
  }
}
