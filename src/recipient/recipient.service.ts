import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipient } from './entities/recipient.entity';
import { RecipientType } from './entities/enums/recipient-type.enum';

@Injectable()
export class RecipientService implements OnModuleInit {
  constructor(
    @InjectRepository(Recipient)
    private readonly recipientRepository: Repository<Recipient>,
  ) {}

  async onModuleInit() {
    const recipientTypes = Object.values(RecipientType);

    const existingRecipients = await this.recipientRepository.find();
    const existingTypes = new Set(existingRecipients.map((r) => r.type));

    const newRecipients = recipientTypes
      .filter((typeName) => !existingTypes.has(typeName))
      .map((typeName) => this.recipientRepository.create({ type: typeName }));

    if (newRecipients.length > 0)
      await this.recipientRepository.save(newRecipients);
  }

  async getAllRecipientTypes(): Promise<Recipient[]> {
    return this.recipientRepository.find();
  }
}
