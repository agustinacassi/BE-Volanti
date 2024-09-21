import { Injectable, Inject } from '@nestjs/common';
import { Cliente } from 'src/database/entities/client.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClientService {
  constructor(
    @Inject('CLIENT_REPOSITORY')
    private clientRepository: Repository<Cliente>,
  ) {}

  async findAll(): Promise<Cliente[]> {
    return this.clientRepository.find();
  }
}