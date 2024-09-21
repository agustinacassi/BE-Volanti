import { Injectable, Inject } from '@nestjs/common';
import { Vehiculo } from 'src/database/entities/vehicle.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VehicleService {
  constructor(
    @Inject('VEHICLE_REPOSITORY')
    private vehicleRepository: Repository<Vehiculo>,
  ) {}

  async findAll(): Promise<Vehiculo[]> {
    return this.vehicleRepository.find();
  }

  async create(vehicleData: Vehiculo): Promise<Vehiculo> {
    const newVehicle = this.vehicleRepository.create(vehicleData); 
    return this.vehicleRepository.save(newVehicle); 
  }
}