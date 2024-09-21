import { Body, Controller, Get, Post } from '@nestjs/common';
import { ClientService } from './client.service';
import { Cliente } from 'src/database/entities/client.entity';

@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get()
  async findAll(): Promise<Cliente[]> {
    return this.clientService.findAll();
  }

  @Post()
  async create(@Body() clienteData: Cliente): Promise<Cliente> {
    return this.clientService.create(clienteData);
  }
}
