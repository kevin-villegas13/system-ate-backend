import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecipientType } from './entities/recipient.entity';

@Injectable()
export class RecipientService implements OnModuleInit {
  constructor(
    @InjectRepository(RecipientType)
    private readonly recipientRepository: Repository<RecipientType>,
  ) {}

  async onModuleInit() {
    const recipientTypes = ['Afiliado', 'Hijo de Afiliado', 'Otro'];

    for (const typeName of recipientTypes) {
      const exists = await this.recipientRepository.findOne({
        where: { typeName },
      });
      if (!exists) await this.recipientRepository.save({ typeName });
    }
  }

  async getAllRecipientTypes(): Promise<RecipientType[]> {
    return this.recipientRepository.find();
  }
}
