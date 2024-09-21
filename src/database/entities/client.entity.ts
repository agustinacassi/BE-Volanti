import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ClientesVehiculos } from './client_vehicle.entity';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'boolean' })
  is_company: boolean;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  country: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  alias: string;

  @Column({ type: 'char', length: 1, nullable: true })
  gender: string;

  @OneToMany(() => ClientesVehiculos, (clientesVehiculos) => clientesVehiculos.cliente)
  clientesVehiculos: ClientesVehiculos[];
}
