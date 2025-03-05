import { Injectable, OnModuleInit } from '@nestjs/common';
import { Gender } from './entities/gender.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GendersService implements OnModuleInit {
  constructor(
    @InjectRepository(Gender)
    private genderRepository: Repository<Gender>,
  ) {}

  async onModuleInit() {
    const genderNames = ['Masculino', 'Femenino'];

    for (const genderName of genderNames) {
      const exists = await this.genderRepository.findOne({
        where: { genderName },
      });

      if (!exists) {
        const gender = this.genderRepository.create({ genderName });
        await this.genderRepository.save(gender);
      }
    }
  }

  async getAllGenders(): Promise<Gender[]> {
    return this.genderRepository.find();
  }
}
