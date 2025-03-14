import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { Benefit } from './entities/benefit.entity';
import { BenefitType } from './entities/benefit-types.entity';
import { CreateBenefitDto } from './dto/create-benefit.dto';
import { Response } from '../common/response/response.type';
import { BadRequest, Conflict, NotFound } from '../common/exceptions';
import { UpdateBenefitDto } from './dto/update-benefit.dto';
import { UpdateBenefitStatusDto } from './dto/update-benefit-status.dto';
import { CreateBenefitTypeDto } from './dto/create-benefit-type.dto';
import { PaginationBenefitsDto } from './dto/paginador-benefits.dto';
import {
  ResponseList,
  SortOrder,
} from '../common/paginator/type/paginator.interface';
import { Paginator } from '../common/paginator/paginator.helper';
import { SafeBenefit } from './interface/safe-benefit.type';
import { omit } from 'lodash';

@Injectable()
export class BenefitsService {
  constructor(
    @InjectRepository(Benefit)
    private readonly benefitRepository: Repository<Benefit>,

    @InjectRepository(BenefitType)
    private readonly typeRepoRepository: Repository<BenefitType>,
  ) {}

  async create(createBenefitDto: CreateBenefitDto): Promise<Response<null>> {
    const { typeId, name, ...dataBenefit } = createBenefitDto;

    const [type, existingBenefit] = await Promise.all([
      this.typeRepoRepository.findOne({ where: { id: typeId } }),
      this.benefitRepository.findOne({
        where: { name, type: { id: typeId } },
      }),
    ]);

    if (!type) throw new NotFound('Tipo de beneficio no encontrado');

    if (dataBenefit.stock < 0)
      throw new BadRequest('El stock no puede ser negativo');

    if (existingBenefit)
      throw new BadRequest('Ya existe un beneficio con este nombre y tipo');

    const newBenefit = this.benefitRepository.create({
      ...dataBenefit,
      name,
      type,
    });

    await this.benefitRepository.save(newBenefit);

    return {
      status: true,
      data: null,
      message: 'Beneficio creado exitosamente',
    };
  }

  async createBenefitType(
    createBenefitTypeDto: CreateBenefitTypeDto,
  ): Promise<Response<null>> {
    const { typeName } = createBenefitTypeDto;

    const exists = await this.typeRepoRepository.findOne({
      where: { typeName: typeName },
    });

    if (exists) throw new BadRequest('Este tipo de beneficio ya existe.');

    const benefitType = this.typeRepoRepository.create(createBenefitTypeDto);
    const savedType = await this.typeRepoRepository.save(benefitType);
    return {
      status: true,
      message: 'Benefit type created successfully',
      data: null,
    };
  }

  async updateBenefit(
    id: string,
    updateBenefitDto: UpdateBenefitDto,
  ): Promise<Response<null>> {
    const { typeId, stock, ...updateData } = updateBenefitDto;

    const [benefit, benefitType] = await Promise.all([
      this.benefitRepository.findOneBy({ id }),
      typeId ? this.typeRepoRepository.findOneBy({ id: typeId }) : null,
    ]);

    if (!benefit) throw new NotFound('Beneficio no encontrado');

    if (typeId && !benefitType)
      throw new NotFound('Tipo de beneficio no encontrado');

    Object.assign(benefit, updateData);
    await this.benefitRepository.save(benefit);

    return {
      status: true,
      data: null,
      message: 'Benefit updated successfully',
    };
  }

  async paginateBenefits(
    paginationDto: PaginationBenefitsDto,
  ): Promise<ResponseList<SafeBenefit>> {
    const {
      page,
      limit,
      search,
      order = SortOrder.ASC,
      type_id,
      is_available,
      age_range,
    } = paginationDto;

    const currentPage = Math.max(1, page);
    const currentLimit = Math.max(1, limit);

    const where: FindOptionsWhere<Benefit> = {
      ...(search ? { name: ILike(`%${search}%`) } : {}),
      ...(type_id ? { type: { id: type_id } } : {}),
      ...(typeof is_available === 'boolean'
        ? { isAvailable: is_available }
        : { isAvailable: true }),
      ...(age_range ? { ageRange: age_range } : {}),
    };

    const [data, count] = await this.benefitRepository.findAndCount({
      where,
      relations: ['type'],
      order: { name: order },
      skip: (currentPage - 1) * currentLimit,
      take: currentLimit,
    });

    const cleanData: SafeBenefit[] = data.map((benefit) => ({
      ...omit(benefit, ['createdAt', 'updatedAt']),
      type: benefit.type
        ? { id: benefit.type.id, typeName: benefit.type.typeName }
        : { id: 0, typeName: '' },
    }));

    return Paginator.Format(
      cleanData,
      count,
      currentPage,
      currentLimit,
      search,
      order,
    );
  }

  async findOneBenefit(id: string): Promise<Response<Benefit>> {
    const benefit = await this.benefitRepository.findOne({
      where: {
        id: id,
      },
      relations: ['type'],
    });

    if (!benefit) throw new Conflict('Beneficio no encontrado');

    const cleanBenefit = omit(benefit, ['createdAt', 'updatedAt']) as Benefit;

    return {
      status: true,
      message: 'Beneficio encontrado exitosamente',
      data: cleanBenefit,
    };
  }

  async deleteBenefit(id: string): Promise<Response<null>> {
    const { affected } = await this.benefitRepository.delete(id);

    if (!affected) throw new NotFound('Beneficio no encontrado');

    return {
      status: true,
      data: null,
      message: 'Benefit deleted successfully',
    };
  }

  async updateBenefitStatus(
    id: string,
    updateBenefitStatusDto: UpdateBenefitStatusDto,
  ): Promise<Response<null>> {
    const { isAvailable } = updateBenefitStatusDto;

    const benefit = await this.benefitRepository.findOne({ where: { id: id } });

    if (!benefit) throw new NotFound('Beneficio no encontrado');

    benefit.isAvailable = isAvailable;
    await this.benefitRepository.save(benefit);

    return {
      status: true,
      data: null,
      message: 'Benefit status updated successfully',
    };
  }
}
