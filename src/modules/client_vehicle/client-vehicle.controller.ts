import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ClienteVehiculoService } from './cliente-vehicle.service';

@Controller('clientes_vehiculos')
export class ClienteVehiculoController {
  constructor(private readonly clienteVehiculoService: ClienteVehiculoService) {}

  @Get()
  async getAllLeads(@Query() query) {
  
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

  @Delete(':id')
  async deleteLead(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.clienteVehiculoService.remove(id);
      return { data: { id } };
    } catch (error) {
      console.error(`Error eliminando el cliente con ID ${id}:`, error.message);
      throw new BadRequestException(`No se pudo eliminar el cliente con ID ${id}`);
    }
  }

  @Delete()
  async deleteLeads(@Body('ids') ids: number[]) {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new BadRequestException('Debe proporcionar un array de IDs de clientes para eliminar.');
    }

    try {
      const results = await Promise.all(ids.map(async (id) => {
        await this.clienteVehiculoService.remove(id);
        return id;
      }));

      return { data: results };
    } catch (error) {
      console.error('Error eliminando múltiples clientes:', error.message);
      throw new BadRequestException('Ocurrió un error al eliminar múltiples registros.');
    }
  }
}