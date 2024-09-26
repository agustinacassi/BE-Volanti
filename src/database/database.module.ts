import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';

/**
 * @module DatabaseModule
 * @description Módulo que encapsula la configuración y los proveedores de la base de datos.
 * 
 * Este módulo es responsable de proporcionar y exportar los proveedores de base de datos
 * para que estén disponibles en toda la aplicación.
 */
@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}