import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Affiliate } from './entities/affiliate.entity';
import { Repository } from 'typeorm';
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
  ): Promise<Response<Affiliate>> {
    const { genderId, sectorId, ...affiliateData } = createAffiliateDto;

    const existingAffiliate = await this.affiliateRepository.findOne({
      where: { dni: createAffiliateDto.dni },
    });

    if (existingAffiliate)
      throw new Conflict('Ya existe un afiliado con este DNI.');

    // Buscar el género y el sector
    const gender = await this.genderRepository.findOne({
      where: { id: genderId },
    });

    const sector = await this.sectorRepository.findOne({
      where: { id: sectorId },
    });

    // Si no se encuentran el género o el sector, lanzar un error
    if (!gender || !sector)
      throw new NotFound('Género o sector no encontrados.');

    const affiliate = this.affiliateRepository.create({
      ...affiliateData,
      gender,
      sector,
    });

    // Guardar el afiliado en la base de datos
    const savedAffiliate = await this.affiliateRepository.save(affiliate);

    return {
      status: true,
      message: 'Afiliado creado correctamente.',
      data: savedAffiliate,
    };
  }

  async getAllAffiliates(
    paginationDto: PaginationAffiliatesDto,
  ): Promise<ResponseList<Affiliate>> {
    const {
      page,
      limit,
      search,
      order = SortOrder.ASC,
      genderId,
      sectorId,
    } = paginationDto;

    // Creamos el QueryBuilder para la consulta
    const queryBuilder = this.affiliateRepository
      .createQueryBuilder('affiliate')
      .leftJoinAndSelect('affiliate.gender', 'gender')
      .leftJoinAndSelect('affiliate.sector', 'sector');

    if (search)
      queryBuilder.andWhere('affiliate.affiliateName ILIKE :search', {
        search: `%${search}%`,
      });

    if (genderId) queryBuilder.andWhere('gender.id = :genderId', { genderId });

    if (sectorId) queryBuilder.andWhere('sector.id = :sectorId', { sectorId });
    
    if (order === SortOrder.ASC || order === SortOrder.DESC)
      queryBuilder.orderBy(
        'affiliate.affiliateName',
        order === SortOrder.ASC ? 'ASC' : 'DESC',
      );

    const [data, count] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return Paginator.Format(data, count, page, limit, search, order);
  }

  async getAffiliateByAffiliateCode(
    affiliate_code: string,
  ): Promise<Response<Affiliate>> {
    console.log('Buscando afiliado con código de afiliado:', affiliate_code); // Verifica el código recibido

    const queryBuilder =
      this.affiliateRepository.createQueryBuilder('affiliate');

    // Unimos las entidades relacionadas
    queryBuilder
      .leftJoinAndSelect('affiliate.gender', 'gender')
      .leftJoinAndSelect('affiliate.sector', 'sector');

    // Imprimir la consulta SQL generada para la depuración
    const query = queryBuilder.getQuery();
    console.log('Consulta SQL generada:', query);

    // Buscamos el afiliado por su código de afiliado (affiliate_code)
    const affiliate = await queryBuilder
      .where('LOWER(affiliate.affiliate_code) = LOWER(:affiliate_code)', {
        affiliate_code,
      })
      .getOne();

    // Si no se encuentra el afiliado, lanzamos un error
    if (!affiliate) {
      throw new NotFound(`Affiliate with code ${affiliate_code} not found`);
    }

    return {
      status: true,
      message: 'Afiliado creado correctamente.',
      data: affiliate,
    };
  }
}
