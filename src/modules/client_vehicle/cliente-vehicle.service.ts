import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Cliente } from 'src/database/entities/client.entity';
import { ClientesVehiculos } from 'src/database/entities/client_vehicle.entity';
import { Vehiculo } from 'src/database/entities/vehicle.entity';
import { Repository } from 'typeorm';
import * as phoneUtil from 'google-libphonenumber';

@Injectable()
export class ClienteVehiculoService {
  private phoneUtil: phoneUtil.PhoneNumberUtil;

  constructor(
    @Inject('CLIENTE_REPOSITORY')
    private clienteRepository: Repository<Cliente>,
    @Inject('VEHICULO_REPOSITORY')
    private vehiculoRepository: Repository<Vehiculo>,
    @Inject('CLIENTES_VEHICULOS_REPOSITORY')
    private clientesVehiculosRepository: Repository<ClientesVehiculos>
  ) {
    this.phoneUtil = phoneUtil.PhoneNumberUtil.getInstance();
  }

  async findAll(options: any): Promise<[Cliente[], number]> {
    return this.clienteRepository.findAndCount({
      ...options,
      relations: ['clientesVehiculos', 'clientesVehiculos.vehiculo'],
    });
  }

  async createNormalizedFromCSV(wordwareRawData: string): Promise<void> {
    
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
  
    for (const item of cleanJson) {
      const normalizedPhone = this.normalizePhoneNumber(item.phone, item.country);

      // Verificar si el cliente ya existe
      let cliente = await this.clienteRepository.findOne({ where: { phone: normalizedPhone } });
  
      // Si no existe, crear uno nuevo
      if (!cliente) {
        cliente = this.clienteRepository.create({
          name: item.name,
          alias: item.alias,
          phone: normalizedPhone,
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

  private normalizePhoneNumber(phone: string, country: string): string {
    try {
      const number = this.phoneUtil.parse(phone, country);
      if (this.phoneUtil.isValidNumber(number)) {
        return this.phoneUtil.format(number, phoneUtil.PhoneNumberFormat.E164);
      } else {
        console.warn(`Número de teléfono no válido: ${phone}`);
        return this.additionalNormalization(phone)
      }
    } catch (error) {
      console.error(`Error al normalizar el número de teléfono ${phone}: ${error.message}`);
    }
  }

  private additionalNormalization(phone: string){
    try {
      // Eliminar espacios, paréntesis y guiones
      phone = phone.replace(/[ ()-]/g, '');

      // Casos con prefijo de país
      if (phone.startsWith('54')) {
          if (!phone.startsWith('+')) {
              phone = '+' + phone; // Añadir el '+' si no está presente
          }

          // Caso: +54911, pero sin el 15 en el medio
          if (phone.length === 14 && phone.startsWith('+54911')) {
              return phone; // Si ya es correcto, devolver el número
          }

          // Caso: +5411 seguido de un número de teléfono sin 9
          if (phone.startsWith('+5411') && phone.length === 13) {
              phone = phone.replace('+5411', '+54911');
          }

          // Caso: Sobran números al final
          if (phone.length > 14) {
              phone = phone.slice(0, 14); // Limitar a los primeros 14 caracteres
          }
      }

      // Casos sin prefijo de país
      else if (phone.startsWith('15')) {
          // Quitar el 15 y agregar +54911
          phone = '+54911' + phone.slice(2);
      }
      else if (phone.startsWith('11')) {
          // Agregar +549 antes del 11
          phone = '+549' + phone;
      }
      else if (phone.startsWith('9')) {
          // Si ya tiene un 9 adelante, solo agregar el '+'
          phone = '+' + phone;
      }
      else if (phone.startsWith('0')) {
          // Quitar el 0 y agregar +549
          phone = '+549' + phone.slice(1);
      }

      // Validar el número con el formato E164 usando google-libphonenumber
      const number = this.phoneUtil.parse(phone, 'AR');
      if (this.phoneUtil.isValidNumber(number)) {
          return this.phoneUtil.format(number, phoneUtil.PhoneNumberFormat.E164);
      } else {
          console.warn(`Número de teléfono no válido: ${phone}`);
      }
  } catch (error) {
      console.error(`Error al normalizar el número de teléfono ${phone}: ${error.message}`);
  }
  return phone; // Devolver el número en caso de no poder normalizar correctamente
  }

  async remove(clienteId: number): Promise<void> {
    const clientesVehiculos = await this.clientesVehiculosRepository.find({
      where: { cliente: { id: clienteId } },
      relations: ['cliente', 'vehiculo'],
    });

    if (clientesVehiculos.length === 0) {
      throw new NotFoundException(`No se encontraron relaciones para el cliente con ID ${clienteId}`);
    }

    // Eliminar todas las relaciones cliente-vehículo
    await this.clientesVehiculosRepository.remove(clientesVehiculos);

    // Eliminar el cliente
    await this.clienteRepository.delete(clienteId);

    // Eliminar vehículos que ya no están asociados a ningún cliente
    for (const cv of clientesVehiculos) {
      const vehiculoTieneMasClientes = await this.clientesVehiculosRepository.count({
        where: { vehiculo: { id: cv.vehiculo.id } },
      });
      if (vehiculoTieneMasClientes === 0) {
        await this.vehiculoRepository.delete(cv.vehiculo.id);
      }
    }
  }
  
}
