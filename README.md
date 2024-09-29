# Configuración del Proyecto

Este README proporciona instrucciones para configurar el entorno de desarrollo, incluyendo la base de datos y las variables de entorno necesarias para ejecutar el proyecto.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- PostgreSQL (versión 12 o superior)
- Node.js (versión 14 o superior)
- npm 

## Configuración de la Base de Datos

1. Asegúrate de tener PostgreSQL en ejecución en tu sistema.

2. Crea una nueva base de datos para el proyecto:

   ```
   createdb nombre_de_tu_base
   ```

3. Creá las tablas de la base de datos con los comandos propuestos en el archivo estructura_bd.sql


4. Verifica que las tablas se hayan creado correctamente:

   ```
   psql -d nombre_de_tu_base
   \dt
   \q
   ```

## Configuración de Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```
DATABASE_USER=tu_usuario
DATABASE_PASSWORD=tu_contraseña
DATABASE_NAME=nombre_de_tu_base
WORDWARE_API_KEY=apikey
WORDWARE_API_URL=api_url
```

Asegúrate de reemplazar los valores con tus credenciales y la información correcta.

## Instalación de Dependencias

Ejecuta el siguiente comando en la raíz del proyecto para instalar todas las dependencias necesarias:

```
npm install
```

## Ejecución del Proyecto

Para iniciar el servidor de desarrollo, ejecuta:

```
npm run start:dev
```

## Información adicional

La normalización se realiza con el siguiente agente deployado en Wordware AI:

https://app.wordware.ai/explore/featured/64bbca92-d364-4039-9e05-ea73b86c3913

## Soporte

Quedo a disposición si hay preguntas :)
