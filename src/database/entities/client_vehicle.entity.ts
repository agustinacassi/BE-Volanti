import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Vehiculo } from 'src/database/entities/vehicle.entity';
import { Cliente } from './client.entity';

@Entity('clientes_vehiculos')
export class ClientesVehiculos {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cliente, (cliente) => cliente.clientesVehiculos)
  cliente: Cliente;

  @ManyToOne(() => Vehiculo, (vehiculo) => vehiculo.clientesVehiculos)
  vehiculo: Vehiculo;
}
