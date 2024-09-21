import { Body, Controller, Get, Post } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { Vehiculo } from 'src/database/entities/vehicle.entity';


@Controller('vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Get()
  async findAll(): Promise<Vehiculo[]> {
    return this.vehicleService.findAll();
  }

  @Post()
  async create(@Body() vehicleData: Vehiculo): Promise<Vehiculo> {
    return this.vehicleService.create(vehicleData);
  }
}