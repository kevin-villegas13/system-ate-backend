import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DelegateBenefit } from '../delegates/entities/delegate-benefit.entity';
import { Delegate } from '../delegates/entities/delegate.entity';
import { AssignBenefitDto } from './dto/assign-benefit.dto';
import { Response } from '../common/response/response.type';
import { Benefit } from '../benefits/entities/benefit.entity';
import { BadRequest, NotFound } from '../common/exceptions';
import { UpdateDelegateAssignmentDto } from './dto/update-delegate_assignment.dto';

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

  async updateAssignment(
    id: number,
    updateDto: UpdateDelegateAssignmentDto,
  ): Promise<Response<DelegateBenefit>> {
    return await this.dataSource.transaction(async (manager) => {
      const assignment = await this.delegateBenefitRepository.findOne({
        where: { id },
        relations: ['benefit'],
        lock: { mode: 'pessimistic_write' }, 
      });

      if (!assignment) throw new NotFound('La asignación no existe.');

      const { quantity: newQuantity = 0 } = updateDto;
      const { quantity: currentQuantity, benefit } = assignment;

      // Calcular la diferencia
      const difference = newQuantity - currentQuantity;

      // Si se aumenta, revisar el stock disponible
      if (difference > 0) {

        if (benefit.stock < difference)
          throw new BadRequest('Stock insuficiente para la actualización.');

        benefit.stock -= difference; 
      }

      // Si se reduce, devolver al stock
      if (difference < 0) benefit.stock += Math.abs(difference);

      await manager.save(benefit);

      // Actualizar la asignación
      await manager.update(DelegateBenefit, id, updateDto);

      const updatedAssignment = await this.delegateBenefitRepository.findOneBy({
        id,
      });

      return {
        status: true,
        message: 'Asignación actualizada con éxito.',
        data: updatedAssignment,
      };
    });
  }

  async deleteAssignment(id: number): Promise<Response<null>> {
    return await this.dataSource.transaction(async (manager) => {
      const assignment = await this.delegateBenefitRepository.findOne({
        where: { id },
        relations: ['benefit'],
        lock: { mode: 'pessimistic_write' },
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

  async getHistoryByDelegate(delegateId: string): Promise<DelegateBenefit[]> {
    return this.delegateBenefitRepository.find({
      where: { delegate: { id: delegateId } },
      relations: ['benefit', 'delegate'],
    });
  }
}
