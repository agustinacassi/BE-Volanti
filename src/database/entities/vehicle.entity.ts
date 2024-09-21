import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ClientesVehiculos } from './client_vehicle.entity';

@Entity('vehiculos')
export class Vehiculo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  brand: string;

  @Column({ type: 'varchar', length: 255 })
  model: string;

  @Column({ type: 'varchar', length: 20 })
  plate: string;

  @OneToMany(() => ClientesVehiculos, (clientesVehiculos) => clientesVehiculos.vehiculo)
  clientesVehiculos: ClientesVehiculos[];
}
