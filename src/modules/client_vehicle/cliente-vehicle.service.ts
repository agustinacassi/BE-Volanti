import { Injectable, Inject } from '@nestjs/common';
import { Cliente } from 'src/database/entities/client.entity';
import { ClientesVehiculos } from 'src/database/entities/client_vehicle.entity';
import { Vehiculo } from 'src/database/entities/vehicle.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClienteVehiculoService {
  constructor(
    @Inject('CLIENTE_REPOSITORY')
    private clienteRepository: Repository<Cliente>,
    @Inject('VEHICULO_REPOSITORY')
    private vehiculoRepository: Repository<Vehiculo>,
    @Inject('CLIENTES_VEHICULOS_REPOSITORY')
    private clientesVehiculosRepository: Repository<ClientesVehiculos>
  ) {}

  async findAll(options: any): Promise<[Cliente[], number]> {
    return this.clienteRepository.findAndCount({
      ...options,
      relations: ['clientesVehiculos', 'clientesVehiculos.vehiculo'],
    });
  }

  async createFromApi(apiData: any[]): Promise<void> {
    for (const item of apiData) {
      // Verificar si el cliente ya existe
      let cliente = await this.clienteRepository.findOne({ where: { phone: item.phone } });

      // Si no existe, crear uno nuevo
      if (!cliente) {
        cliente = this.clienteRepository.create({
          name: item.name,
          alias: item.alias,
          phone: item.phone,
          country: item.country,
          gender: item.gender,
          isCompany: item.is_company,
        });
        await this.clienteRepository.save(cliente);
      }

      // Verificar si el vehículo ya existe
      let vehiculo = await this.vehiculoRepository.findOne({ where: { plate: item.plate } });

      // Si no existe, crear uno nuevo
      if (!vehiculo) {
        vehiculo = this.vehiculoRepository.create({
          brand: item.brand,
          model: item.model,
          plate: item.plate,
        });
        await this.vehiculoRepository.save(vehiculo);
      }

      // Crear la relación cliente-vehículo si no existe
      const existingRelation = await this.clientesVehiculosRepository.findOne({
        where: { cliente: cliente, vehiculo: vehiculo },
      });

      if (!existingRelation) {
        const clienteVehiculo = this.clientesVehiculosRepository.create({
          cliente,
          vehiculo,
        });
        await this.clientesVehiculosRepository.save(clienteVehiculo);
      }
    }
  }
}