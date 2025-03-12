import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Benefit } from './entities/benefit.entity';
import { BenefitType } from './entities/benefit-types.entity';
import { DelegateBenefit } from '../delegates/entities/delegate-benefit.entity';
import { Delegate } from '../delegates/entities/delegate.entity';
import { CreateBenefitDto } from './dto/create-benefit.dto';
import { Response } from '../common/response/response.type';
import { BadRequest, NotFound } from '../common/exceptions';
import { UpdateBenefitDto } from './dto/update-benefit.dto';
import { AssignBenefitDto } from './dto/assign-benefit.dto';
import { UpdateBenefitStatusDto } from './dto/update-benefit-status.dto';
import { CreateBenefitTypeDto } from './dto/create-benefit-type.dto';

@Injectable()
export class BenefitsService {
  constructor(
    @InjectRepository(Benefit)
    private readonly benefitRepository: Repository<Benefit>,
    @InjectRepository(BenefitType)
    private readonly typeRepoRepository: Repository<BenefitType>,
    @InjectRepository(DelegateBenefit)
    private readonly delegateBenefitRepository: Repository<DelegateBenefit>,
    @InjectRepository(Delegate)
    private readonly delegateRepository: Repository<Delegate>,
    private readonly dataSource: DataSource,
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

  async deleteBenefit(id: number): Promise<Response<null>> {
    const { affected } = await this.benefitRepository.delete(id);

    if (!affected) throw new NotFound('Beneficio no encontrado');

    return {
      status: true,
      data: null,
      message: 'Benefit deleted successfully',
    };
  }

  async assignBenefitToDelegate(
    assignBenefitDto: AssignBenefitDto,
  ): Promise<Response<null>> {
    const { benefitId, delegateId, quantity } = assignBenefitDto;

    const [benefit, delegate] = await Promise.all([
      this.benefitRepository.findOne({ where: { id: benefitId } }),
      this.delegateRepository.findOne({ where: { id: delegateId } }),
    ]);

    if (!benefit) throw new NotFound('El beneficio no existe.');

    if (!benefit.isAvailable)
      throw new BadRequest('El beneficio no está disponible.');

    if (benefit.stock < quantity)
      throw new BadRequest('No hay suficiente stock disponible.');

    if (!delegate) throw new NotFound('El delegado no fue encontrado.');

    return await this.dataSource.transaction(async (manager) => {
      // Actualizar el stock
      benefit.stock -= quantity;
      await manager.save(benefit);

      // Crear la asignación
      const assignment = this.delegateBenefitRepository.create({
        benefit,
        delegate,
        quantity,
        assignmentDate: new Date(),
      });

      await manager.save(assignment);

      return {
        status: true,
        message: 'Beneficio asignado con éxito',
        data: null,
      };
    });
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
