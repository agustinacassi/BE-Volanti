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

  async createNormalizedFromCSV(wordwareRawData: string): Promise<void> {
    console.log(wordwareRawData, 'raw');
    
    // Parsear la cadena de entrada en un array de objetos
    const responseObjects = wordwareRawData
      .split('\n')
      .filter(line => line.trim() !== '')
      .map(line => JSON.parse(line));
  
    // Encontrar el objeto que contiene el JSON que necesitamos
    const jsonObject = responseObjects.find(obj => 
      obj.type === 'chunk' && 
      obj.value?.type === 'prompt' && 
      obj.value?.state === 'complete' &&
      obj.value?.output
    );
  
    if (!jsonObject) {
      throw new Error('No se encontró el objeto JSON esperado en la respuesta');
    }
  
    // Obtener el contenido JSON
    const outputKeys = Object.keys(jsonObject.value.output);
    let jsonContent: string | null = null;
  
    // Buscar en todas las claves de output
    for (const key of outputKeys) {
      const content = jsonObject.value.output[key];
      if (typeof content === 'string' && content.includes('```json')) {
        jsonContent = content;
        break;
      }
    }
  
    if (!jsonContent) {
      throw new Error('No se encontró contenido JSON válido en la respuesta');
    }
  
    // Extraer el JSON del formato markdown
    const jsonMatch = jsonContent.match(/```json\n([\s\S]*?)\n```/);
    if (!jsonMatch) {
      throw new Error('No se pudo extraer el JSON del contenido');
    }
  
    const cleanJson = JSON.parse(jsonMatch[1]);
  
    console.log(cleanJson);
  
    for (const item of cleanJson) {
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
        where: { cliente: { id: cliente.id }, vehiculo: { id: vehiculo.id } },
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