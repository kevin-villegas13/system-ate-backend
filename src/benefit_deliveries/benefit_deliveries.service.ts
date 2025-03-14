import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BenefitDistribution } from './entities/benefit_delivery.entity';
import { BadRequest, NotFound } from '../common/exceptions';
import { Benefit } from '../benefits/entities/benefit.entity';
import { CreateBenefitDeliveryDto } from './dto/create-benefit_delivery.dto';
import { DeliveryStatus } from '../delivery/entities/delivery.entity';
import { Response } from '../common/response/response.type';
import { RecipientType } from 'src/recipient/entities/recipient.entity';
import { DelegateBenefit } from 'src/delegate_assignments/entities/delegate-benefit.entity';
import { UpdateBenefitDeliveryDto } from './dto/update-benefit_delivery.dto';
import { omit } from 'lodash';
import { SafeBenefitDistribution } from './interfaces/safe-benefit_deliveries.type';

@Injectable()
export class BenefitDeliveriesService {
  constructor(
    @InjectRepository(BenefitDistribution)
    private readonly distributionRepository: Repository<BenefitDistribution>,

    @InjectRepository(DeliveryStatus)
    private readonly deliveryRepository: Repository<DeliveryStatus>,

    @InjectRepository(RecipientType)
    private readonly recipientTypeRepository: Repository<RecipientType>,

    @InjectRepository(DelegateBenefit)
    private readonly delegateBenefitRepository: Repository<DelegateBenefit>,

    private readonly dataSource: DataSource,
  ) {}
  private readonly takeStates = [1, 2, 3]; // Reducen el stock
  private readonly giveStates = [4, 5, 6]; // Devuelven el stock

  async createDistribution(
    dto: CreateBenefitDeliveryDto,
  ): Promise<Response<null>> {
    const { benefitId, recipientId, recipientType, statusId, quantity } = dto;

    // Obtener las entidades necesarias
    const [status, delegateBenefit, recipientTypeEntity, existingDistribution] =
      await Promise.all([
        this.deliveryRepository.findOne({ where: { id: statusId } }),
        this.delegateBenefitRepository.findOne({
          where: { benefit: { id: benefitId } },
          relations: ['delegate', 'benefit'],
        }),
        this.recipientTypeRepository.findOne({ where: { id: recipientType } }),
        this.distributionRepository.findOne({
          where: {
            benefit: { id: benefitId },
            recipientId,
            recipientType: { id: recipientType },
          },
        }),
      ]);

    // Validaciones
    if (!status) throw new NotFound('El estado de distribución no existe.');
    if (!delegateBenefit)
      throw new NotFound('No hay stock asignado para este beneficio.');
    if (!recipientTypeEntity)
      throw new NotFound('El tipo de recipiente no existe.');
    if (existingDistribution)
      throw new BadRequest(
        'Este destinatario ya tiene una distribución para este beneficio.',
      );

    // Validación de stock insuficiente si el estado lo requiere
    if (
      this.takeStates.includes(status.id) &&
      delegateBenefit.quantity < quantity
    ) {
      throw new BadRequest(
        `Stock insuficiente. Disponible: ${delegateBenefit.quantity}`,
      );
    }

    // Definir el mensaje de éxito y otros posibles estados
    let message = 'Distribución creada con éxito.';
    const statusMessages: Record<number, string> = {
      4: 'La distribución ha fallado, el stock ha sido restablecido a 0 debido a un error en el proceso.',
      5: 'La distribución ha sido cancelada, el stock ha sido restablecido a 0.',
      6: 'La distribución está retrasada, el stock ha sido restablecido a 0 hasta que se resuelva el retraso.',
    };

    if (this.takeStates.includes(status.id)) {
      delegateBenefit.quantity -= quantity;
    }

    // Si el estado es de "dar", restablecer cantidad y actualizar el mensaje
    if (this.giveStates.includes(status.id)) {
      dto.quantity = 0;
      message = statusMessages[status.id] || message;
    }

    return this.dataSource.transaction(async (manager) => {
      await manager.save(delegateBenefit);

      // Crear y guardar la distribución
      const distribution = manager.create(BenefitDistribution, {
        ...dto,
        status: { id: statusId },
        benefit: delegateBenefit.benefit,
        recipientType: recipientTypeEntity,
      });

      await manager.save(distribution);

      return { status: true, message, data: null };
    });
  }

  async getDistributionById(
    id: string,
  ): Promise<Response<SafeBenefitDistribution>> {
    // Buscar distribución
    const distribution = await this.distributionRepository.findOne({
      where: { id },
      relations: ['status', 'recipientType', 'benefit'],
    });

    if (!distribution) throw new NotFound('La distribución no existe.');

    // Buscar el beneficio delegado
    const delegateBenefit = await this.delegateBenefitRepository.findOne({
      where: { benefit: { id: distribution.benefit.id } },
      relations: ['delegate'],
    });

    if (!delegateBenefit) throw new NotFound('El delegado asignado no existe.');

    // Omitir propiedades no importantes de la distribución, beneficio y delegado
    const distributionData = omit(distribution, [
      'benefit',
      'updatedAt',
      'createdAt',
    ]) as Omit<BenefitDistribution, 'benefit' | 'delegate'>;

    const benefitData = omit(distribution.benefit, [
      'createdAt',
      'updatedAt',
      'stock',
    ]);

    const delegateData = omit(delegateBenefit.delegate, [
      'dni',
      'createdAt',
      'updatedAt',
      'isActive',
    ]);

    const result: SafeBenefitDistribution = {
      ...distributionData,
      benefit: benefitData,
      delegate: delegateData,
    };

    return {
      status: true,
      message: 'Distribución encontrada con éxito.',
      data: result,
    };
  }

  async updateDistribution(
    id: string,
    dto: UpdateBenefitDeliveryDto,
  ): Promise<Response<BenefitDistribution>> {
    const { benefitId, recipientId, recipientType, statusId, quantity, notes } =
      dto;

    const [existingDistribution, delegateBenefit, recipientTypeEntity] =
      await Promise.all([
        this.distributionRepository.findOne({
          where: { id },
          relations: ['benefit', 'status'],
        }),
        this.delegateBenefitRepository.findOne({
          where: { benefit: { id: benefitId } },
        }),
        this.recipientTypeRepository.findOne({ where: { id: recipientType } }),
      ]);

    // Validaciones de existencia
    if (!existingDistribution) throw new NotFound('La distribución no existe.');
    if (!delegateBenefit)
      throw new NotFound('El beneficio delegado no existe.');
    if (!recipientTypeEntity)
      throw new BadRequest(
        `El tipo de receptor con ID ${recipientType} no existe.`,
      );

    // Lógica de actualizaciones según el estado
    if (statusId !== undefined) {
      const isTakeState = this.takeStates.includes(statusId);
      const isGiveState = this.giveStates.includes(statusId);

      // Verificar si es un estado de "take" y si hay suficiente stock
      if (isTakeState) {
        if (delegateBenefit.quantity < quantity!) {
          throw new BadRequest(
            `Stock insuficiente para tomar. Disponible: ${delegateBenefit.quantity}`,
          );
        }
        delegateBenefit.quantity -= quantity!;
        existingDistribution.quantity += quantity!;
      }

      // Verificar si es un estado de "give" y si hay suficiente stock en la distribución
      if (isGiveState) {
        if (existingDistribution.quantity < quantity!) {
          throw new BadRequest(
            `No se puede dar más de lo disponible en la distribución. Disponible: ${existingDistribution.quantity}`,
          );
        }
        delegateBenefit.quantity += quantity!;
        existingDistribution.quantity -= quantity!;
      }
    }

    // Asegúrate de que las cantidades no sean negativas
    delegateBenefit.quantity = Math.max(delegateBenefit.quantity, 0);
    existingDistribution.quantity = Math.max(existingDistribution.quantity, 0);

    await this.dataSource.transaction(async (manager) => {
      await manager.save(delegateBenefit);
      Object.assign(existingDistribution, {
        recipientId,
        recipientType: recipientTypeEntity,
        status: { id: statusId },
        notes,
        quantity: existingDistribution.quantity,
      });
      await manager.save(existingDistribution);
    });

    return {
      status: true,
      message: 'Distribución actualizada con éxito.',
      data: null,
    };
  }

  async deleteDistribution(id: string): Promise<Response<null>> {
    const distribution = await this.distributionRepository.findOne({
      where: { id },
      relations: ['benefit', 'status'],
    });

    if (!distribution) throw new NotFound('La distribución no existe.');

    const { status, benefit, quantity } = distribution;

    if (!this.giveStates.includes(status.id))
      throw new BadRequest('No se puede eliminar esta distribución.');

    return this.dataSource.transaction(async (manager) => {
      // Buscar el delegateBenefit si existe
      const delegateBenefit = await this.delegateBenefitRepository.findOne({
        where: { benefit: { id: benefit.id } },
      });

      // Restaurar stock si el estado está en takeStates
      if (this.takeStates.includes(status.id) && delegateBenefit) {
        delegateBenefit.quantity += quantity;
        await manager.save(delegateBenefit);
      }

      // Eliminar la distribución
      await manager.remove(distribution);

      return {
        status: true,
        message: 'Distribución eliminada con éxito.',
        data: null,
      };
    });
  }
}
