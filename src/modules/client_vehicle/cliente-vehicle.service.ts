import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Cliente } from 'src/database/entities/client.entity';
import { Vehiculo } from 'src/database/entities/vehicle.entity';
import { ClientesVehiculos } from 'src/database/entities/client_vehicle.entity';

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

    async establecerRelacion(dto): Promise<any> {
        // Crea un nuevo cliente con los datos proporcionados
        const cliente = this.clienteRepository.create({
            name: dto.name,
            alias: dto.alias,
            gender: dto.gender,
            country: dto.country,
            phone: dto.phone,
            is_company: dto.is_company
        });

        // Crea un nuevo vehículo con los datos proporcionados
        const vehiculo = this.vehiculoRepository.create({
            brand: dto.brand,
            model: dto.model,
            plate: dto.plate
        });

        // Guarda ambos registros en la base de datos
        await this.clienteRepository.save(cliente);
        await this.vehiculoRepository.save(vehiculo);

        // Establece una nueva relación entre el cliente y el vehículo creado
        const nuevaRelacion = new ClientesVehiculos();
        nuevaRelacion.cliente = cliente;
        nuevaRelacion.vehiculo = vehiculo;

        // Guarda la relación en la base de datos
        await this.clientesVehiculosRepository.save(nuevaRelacion);

        // Devuelve la relación creada
        return {
            message: "Relación cliente-vehículo creada exitosamente",
            data: nuevaRelacion
        };
    }

    async obtenerTodasLasRelaciones() {
        return this.clienteRepository.find({
          relations: ['clientesVehiculos', 'clientesVehiculos.vehiculo'],
        });
    }
}
