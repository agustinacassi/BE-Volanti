import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Cliente } from './client.entity';
import { Vehiculo } from './vehicle.entity';

@Entity('clientes_vehiculos')
export class ClientesVehiculos {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cliente, (cliente) => cliente.clientesVehiculos)
  @JoinColumn({ name: 'clienteId' })
  cliente: Cliente;

  @ManyToOne(() => Vehiculo, (vehiculo) => vehiculo.clientesVehiculos)
  @JoinColumn({ name: 'vehiculoId' })
  vehiculo: Vehiculo;
}
