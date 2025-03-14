import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Affiliate } from './entities/affiliate.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { CreateAffiliateDto } from './dto/create-affiliate.dto';
import { Response } from '../common/response/response.type';
import {
  ResponseList,
  SortOrder,
} from 'src/common/paginator/type/paginator.interface';
import { PaginationAffiliatesDto } from './dto/paginador-affiliates.dto';
import { Paginator } from '../common/paginator/paginator.helper';
import { Conflict, NotFound } from '../common/exceptions';
import { Gender } from 'src/genders/entities/gender.entity';
import { Sector } from 'src/sectors/entities/sector.entity';
import { User } from 'src/user/entities/user.entity';
import { UpdateAffiliateDto } from './dto/update-affiliate.dto';
import { omit } from 'lodash';
import { SafeAffiliate, SafeSector } from './interface/safe-affiliate.type';

@Injectable()
export class AffiliatesService {
  constructor(
    @InjectRepository(Affiliate)
    private readonly affiliateRepository: Repository<Affiliate>,

    @InjectRepository(Gender)
    private readonly genderRepository: Repository<Gender>,

    @InjectRepository(Sector)
    private readonly sectorRepository: Repository<Sector>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createAffiliateDto: CreateAffiliateDto,
    userId: string,
  ): Promise<Response<null>> {
    const { genderId, sectorId, ...affiliateData } = createAffiliateDto;

    if (
      await this.affiliateRepository.findOne({
        where: { dni: affiliateData.dni },
      })
    )
      throw new Conflict('Ya existe un afiliado con este DNI.');

    const [gender, sector, user] = await Promise.all([
      this.genderRepository.findOne({ where: { id: genderId } }),
      this.sectorRepository.findOne({ where: { id: sectorId } }),
      this.userRepository.findOne({ where: { id: userId } }),
    ]);

    if (!gender || !sector || !user)
      throw new NotFound('Género, sector o usuario no encontrados.');

    const affiliate = this.affiliateRepository.create({
      ...affiliateData,
      gender,
      sector,
      createdBy: user,
    });

    await this.affiliateRepository.save(affiliate);

    return {
      status: true,
      message: 'Afiliado creado correctamente.',
      data: null,
    };
  }

  async paginatedAffiliates(
    paginationDto: PaginationAffiliatesDto,
  ): Promise<ResponseList<SafeAffiliate>> {
    const {
      page,
      limit,
      search,
      order = SortOrder.ASC,
      genderId,
      sectorId,
    } = paginationDto;

    const where: FindOptionsWhere<Affiliate> = {
      ...(search && { name: ILike(`%${search}%`) }),
      ...(genderId && { gender: { id: genderId } }),
      ...(sectorId && { sector: { id: sectorId } }),
    };

    const [data, count] = await this.affiliateRepository.findAndCount({
      where,
      relations: ['gender', 'sector'],
      order: { name: order },
      skip: (page - 1) * limit,
      take: limit,
    });

    const cleanData: SafeAffiliate[] = data.map((affiliate) => ({
      ...omit(affiliate, ['createdAt', 'updatedAt', 'note']),
      gender: affiliate.gender || undefined,
      sector: affiliate.sector
        ? (omit(affiliate.sector, ['createdAt', 'updatedAt']) as SafeSector)
        : undefined,
    }));

    return Paginator.Format(cleanData, count, page, limit, search, order);
  }

  async getAffiliateByAffiliateCode(
    affiliateCode: string,
  ): Promise<Response<Affiliate>> {
    const affiliate = await this.affiliateRepository.findOne({
      where: { affiliateCode: ILike(affiliateCode) },
      relations: ['gender', 'sector'],
    });

    if (!affiliate)
      throw new NotFound(`Afiliado con código ${affiliateCode} no encontrado.`);

    const sanitizedAffiliate = omit(affiliate, [
      'createdAt',
      'updatedAt',
      'sector.sectorCode',
      'sector.createdAt',
      'sector.updatedAt',
    ]) as Affiliate;

    return {
      status: true,
      message: 'Afiliado encontrado correctamente.',
      data: sanitizedAffiliate,
    };
  }

  async update(
    id: string,
    updateAffiliateDto: UpdateAffiliateDto,
  ): Promise<Response<null>> {
    const affiliate = await this.affiliateRepository.findOne({ where: { id } });

    if (!affiliate) throw new NotFound(`Afiliado con ID ${id} no encontrado.`);

    const [gender, sector] = await Promise.all([
      updateAffiliateDto.genderId
        ? this.genderRepository.findOne({
            where: { id: updateAffiliateDto.genderId },
          })
        : null,

      updateAffiliateDto.sectorId
        ? this.sectorRepository.findOne({
            where: { id: updateAffiliateDto.sectorId },
          })
        : null,
    ]);

    if (updateAffiliateDto.genderId && !gender)
      throw new NotFound('Género no encontrado.');

    if (updateAffiliateDto.sectorId && !sector)
      throw new NotFound('Sector no encontrado.');

    if (gender) affiliate.gender = gender;

    if (sector) affiliate.sector = sector;

    Object.assign(affiliate, updateAffiliateDto);

    await this.affiliateRepository.save(affiliate);

    return {
      status: true,
      message: 'Afiliado actualizado exitosamente.',
      data: null,
    };
  }

  async remove(id: string): Promise<Response<null>> {
    const affiliate = await this.affiliateRepository.findOne({ where: { id } });

    if (!affiliate) throw new NotFound(`Afiliado con ID ${id} no encontrado.`);

    await this.affiliateRepository.remove(affiliate);

    return {
      status: true,
      message: 'Afiliado eliminado exitosamente.',
      data: null,
    };
  }
}
