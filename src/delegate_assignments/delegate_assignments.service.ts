import { Injectable } from '@nestjs/common';
import { DataSource, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DelegateBenefit } from './entities/delegate-benefit.entity';
import { Delegate } from '../delegates/entities/delegate.entity';
import { AssignBenefitDto } from './dto/assign-benefit.dto';
import { Response } from '../common/response/response.type';
import { Benefit } from '../benefits/entities/benefit.entity';
import { BadRequest, NotFound } from '../common/exceptions';
import { UpdateDelegateAssignmentDto } from './dto/update-delegate_assignment.dto';
import { PaginationDelegateBenefitsDto } from './dto/pagination-delegate_assignments.dto';
import { Paginator } from 'src/common/paginator/paginator.helper';
import {
  ResponseList,
  SortOrder,
} from '../common/paginator/type/paginator.interface';
import { SafeDelegateAssignments } from './interfaces/safe-delegate_assignments.type';
import { omit } from 'lodash';

@Injectable()
export class DelegateAssignmentsService {
  constructor(
    @InjectRepository(Benefit)
    private readonly benefitRepository: Repository<Benefit>,

    @InjectRepository(DelegateBenefit)
    private readonly delegateBenefitRepository: Repository<DelegateBenefit>,

    @InjectRepository(Delegate)
    private readonly delegateRepository: Repository<Delegate>,

    private readonly dataSource: DataSource,
  ) {}

  async assignBenefitToDelegate(
    assignBenefitDto: AssignBenefitDto,
  ): Promise<Response<null>> {
    const { benefitId, delegateId, quantity } = assignBenefitDto;

    const [benefit, delegate] = await Promise.all([
      this.benefitRepository.findOne({ where: { id: benefitId } }),
      this.delegateRepository.findOne({ where: { id: delegateId } }),
    ]);

    if (!benefit || !delegate)
      throw new NotFound('Beneficio o delegado no encontrado.');
    if (!benefit.isAvailable || benefit.stock < quantity)
      throw new BadRequest('Beneficio no disponible o sin stock.');

    return this.dataSource.transaction(async (manager) => {
      benefit.stock -= quantity;
      await manager.save(benefit);

      const existingAssignment = await manager.findOneBy(DelegateBenefit, {
        benefit: { id: benefitId },
        delegate: { id: delegateId },
      });

      const assignment = existingAssignment
        ? {
            ...existingAssignment,
            quantity: existingAssignment.quantity + quantity,
            assignmentDate: new Date(),
          }
        : { benefit, delegate, quantity, assignmentDate: new Date() };

      await manager.save(DelegateBenefit, assignment);

      return {
        status: true,
        message: 'Beneficio asignado con éxito',
        data: null,
      };
    });
  }

  async updateAssignment(
    id: number,
    updateDto: UpdateDelegateAssignmentDto,
  ): Promise<Response<null>> {
    return await this.dataSource.transaction(async (manager) => {
      const assignment = await manager.findOne(DelegateBenefit, {
        where: { id },
        relations: ['benefit'],
      });

      if (!assignment) throw new NotFound('La asignación no existe.');

      const { quantity: newQuantity = 0 } = updateDto;
      const { quantity: currentQuantity, benefit } = assignment;

      // Calcular la diferencia
      const difference = newQuantity - currentQuantity;

      // Si se aumenta, revisar el stock disponible
      if (difference > 0 && benefit.stock < difference)
        throw new BadRequest('Stock insuficiente para la actualización.');

      // Actualizar el stock
      if (difference > 0) benefit.stock -= difference;
      if (difference < 0) benefit.stock += Math.abs(difference);

      await manager.save(benefit);

      // Actualizar la asignación
      await manager.update(DelegateBenefit, id, updateDto);

      return {
        status: true,
        message: 'Asignación actualizada con éxito.',
        data: null,
      };
    });
  }

  async deleteAssignment(id: number): Promise<Response<null>> {
    return await this.dataSource.transaction(async (manager) => {
      const assignment = await this.delegateBenefitRepository.findOne({
        where: { id },
        relations: ['benefit'],
      });

      if (!assignment) throw new NotFound('La asignación no existe.');

      // Devolver el stock
      assignment.benefit.stock += assignment.quantity;
      await manager.save(assignment.benefit);

      // Eliminar la asignación
      await manager.delete(DelegateBenefit, id);

      return {
        status: true,
        message: 'Asignación eliminada con éxito.',
        data: null,
      };
    });
  }

  async getHistoryByDelegate(
    paginationDto: PaginationDelegateBenefitsDto,
  ): Promise<ResponseList<SafeDelegateAssignments>> {
    const {
      page,
      limit,
      delegateId,
      order = SortOrder.ASC,
      search,
    } = paginationDto;

    // Asegurar valores válidos para paginación
    const currentPage = Math.max(1, page);
    const currentLimit = Math.max(1, limit);

    const where: FindOptionsWhere<DelegateBenefit> = {
      ...(delegateId ? { delegate: { id: delegateId } } : {}),
      ...(search ? { benefit: { name: ILike(`%${search}%`) } } : {}),
    };

    const [data, count] = await this.delegateBenefitRepository.findAndCount({
      where,
      relations: ['benefit', 'delegate'],
      order: { benefit: { name: order.toUpperCase() as 'ASC' | 'DESC' } },
      skip: (currentPage - 1) * currentLimit,
      take: currentLimit,
    });

    const cleanData = data.map(({ benefit, delegate, ...rest }) => ({
      ...omit(rest, ['createdAt', 'updatedAt']),
      ...omit(benefit, ['createdAt', 'updatedAt']),
      benefit: omit(benefit, ['createdAt', 'updatedAt']),
      delegate: omit(delegate, ['createdAt', 'updatedAt']),
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
}
