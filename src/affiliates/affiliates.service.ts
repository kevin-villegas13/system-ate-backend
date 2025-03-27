import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { omit } from 'lodash';
import { Affiliate } from './entities/affiliate.entity';
import { CreateAffiliateDto } from './dto/create-affiliate.dto';
import { Response } from '../common/response/response.type';
import {
  ResponseList,
  SortOrder,
} from '../common/paginator/type/paginator.interface';
import { PaginationAffiliatesDto } from './dto/paginador-affiliates.dto';
import { Paginator } from '../common/paginator/paginator.helper';
import { Conflict, NotFound } from '../common/exceptions';
import { Gender } from '../genders/entities/gender.entity';
import { Sector } from '../sectors/entities/sector.entity';
import { UpdateAffiliateDto } from './dto/update-affiliate.dto';
import { AffiliateDto } from './dto/affiliates-omit-fields.dto';

@Injectable()
export class AffiliatesService {
  constructor(
    @InjectRepository(Affiliate)
    private readonly affiliateRepository: Repository<Affiliate>,

    @InjectRepository(Gender)
    private readonly genderRepository: Repository<Gender>,

    @InjectRepository(Sector)
    private readonly sectorRepository: Repository<Sector>,
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

    const [gender, sector] = await Promise.all([
      this.genderRepository.findOne({ where: { id: genderId } }),
      this.sectorRepository.findOne({ where: { id: sectorId } }),
    ]);

    if (!gender) throw new NotFound('Género no encontrado.');

    if (!sector) throw new NotFound('Sector no encontrado.');

    const affiliate = this.affiliateRepository.create({
      ...affiliateData,
      gender: gender,
      sector: sector,
      createdBy: { id: userId },
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
  ): Promise<ResponseList<AffiliateDto>> {
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

    const formattedData: AffiliateDto[] = data.map((affiliate) => ({
      ...omit(affiliate, ['note', 'createdAt', 'updatedAt', 'sector']),
      sector: affiliate.sector
        ? omit(affiliate.sector, ['createdAt', 'updatedAt'])
        : undefined,
    }));

    return Paginator.Format(formattedData, count, page, limit, search, order);
  }

  async getAffiliateByAffiliateCode(
    affiliateCode: string,
  ): Promise<Response<AffiliateDto>> {
    const affiliate = await this.affiliateRepository.findOne({
      where: { affiliateCode: ILike(affiliateCode) },
      relations: ['gender', 'sector'],
    });

    if (!affiliate)
      throw new NotFound(`Afiliado con código ${affiliateCode} no encontrado.`);

    const sanitizedAffiliate: AffiliateDto = {
      ...omit(affiliate, ['note', 'createdAt', 'updatedAt', 'sector']),
      sector: affiliate.sector
        ? omit(affiliate.sector, ['createdAt', 'updatedAt'])
        : undefined,
    };

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
