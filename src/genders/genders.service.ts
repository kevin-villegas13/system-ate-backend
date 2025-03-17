import { Injectable, OnModuleInit } from '@nestjs/common';
import { Gender } from './entities/gender.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenderEnum } from './entities/enums/gender.enum';

@Injectable()
export class GendersService implements OnModuleInit {
  constructor(
    @InjectRepository(Gender)
    private genderRepository: Repository<Gender>,
  ) {}

  async onModuleInit() {
    const genders = Object.values(GenderEnum);

    const existingGenders = await this.genderRepository.find();
    const existingNames = new Set(existingGenders.map((g) => g.genderName));

    const newGenders = genders
      .filter((genderName) => !existingNames.has(genderName))
      .map((genderName) => this.genderRepository.create({ genderName }));

    if (newGenders.length > 0) await this.genderRepository.save(newGenders);
  }

  async getAllGenders(): Promise<Gender[]> {
    return this.genderRepository.find();
  }
}
