import { BadRequestException, Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ClienteVehiculoService } from './cliente-vehicle.service';


/**
 * Controller to handle operations related to clients (leads) and their associated vehicles.
 */
@Controller('clientes_vehiculos')
export class ClienteVehiculoController {
  constructor(private readonly clienteVehiculoService: ClienteVehiculoService) {}

  @Get()
  async getAllLeads(@Query() query) {
    console.log('Received query:', query); // For debugging
  
    const { _start = '0', _end = '10', _sort = 'id', _order = 'ASC', ...filter } = query;
    
    const [data, total] = await this.clienteVehiculoService.findAll({
      skip: Number(_start),
      take: Number(_end) - Number(_start),
      order: { [_sort]: _order.toLowerCase() },
      where: filter,
    });
  
    const transformedData = data.map(cliente => ({
      ...cliente,
      vehiculos: cliente.clientesVehiculos?.map(cv => cv.vehiculo) || []
    }));
  
    return {
      data: transformedData,
      total,
    };
  }

}