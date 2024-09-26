import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * Función de inicio de la aplicación.
 * Esta función asíncrona crea y configura la instancia de la aplicación NestJS,
 * habilita CORS, y pone el servidor a la escucha en el puerto especificado.
 * 
 * @async
 * @function bootstrap
 * @throws {Error} Si hay un problema al iniciar el servidor.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3001);
}
bootstrap();