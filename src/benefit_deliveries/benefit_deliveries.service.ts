import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { BenefitDistribution } from './entities/benefit_delivery.entity';
import { BadRequest, NotFound } from '../common/exceptions';
import { CreateBenefitDeliveryDto } from './dto/create-benefit_delivery.dto';
import { DeliveryStatus } from '../delivery/entities/delivery.entity';
import { Response } from '../common/response/response.type';
import { RecipientType } from '../recipient/entities/recipient.entity';
import { DelegateBenefit } from '../delegate_assignments/entities/delegate-benefit.entity';
import { UpdateBenefitDeliveryDto } from './dto/update-benefit_delivery.dto';
import { omit } from 'lodash';
import {
  SafeAffiliate,
  SafeBenefit,
  SafeBenefitDistribution,
  SafeChild,
  SafeDelegate,
} from './interfaces/safe-benefit_deliveries.type';
import { PaginationBenefitDeliveryDto } from './dto/paginador-benefit_delivery.dto';
import {
  ResponseList,
  SortOrder,
} from '../common/paginator/type/paginator.interface';
import { Paginator } from '../common/paginator/paginator.helper';
import { Affiliate } from '../affiliates/entities/affiliate.entity';
import { Child } from '../children/entities/child.entity';

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

    @InjectRepository(Affiliate)
    private readonly affiliateRepository: Repository<Affiliate>,

    @InjectRepository(Child)
    private readonly childRepository: Repository<Child>,

    private readonly dataSource: DataSource,
  ) {}
  private readonly takeStates = [1, 2, 3]; // Reducen el stock
  private readonly giveStates = [4, 5, 6]; // Devuelven el stock

  async createDistribution(
    dto: CreateBenefitDeliveryDto,
  ): Promise<Response<null>> {
    const { benefitId, recipientId, recipientType, statusId, quantity } = dto;

    const [
      status,
      delegateBenefit,
      recipientTypeEntity,
      existingDistribution,
      recipient,
    ] = await Promise.all([
      this.deliveryRepository.findOne({ where: { id: statusId } }),
      this.delegateBenefitRepository.findOne({
        where: { benefit: { id: benefitId } },
        relations: ['delegate', 'benefit'],
      }),
      this.recipientTypeRepository.findOne({ where: { id: recipientType } }),
      this.distributionRepository.findOne({
        where: {
          benefit: { id: benefitId },
          recipientType: { id: recipientType },
          ...(recipientType === 1
            ? { affiliate: { id: recipientId } }
            : { child: { id: recipientId } }),
        },
      }),
      recipientType === 1
        ? this.affiliateRepository.findOne({ where: { id: recipientId } })
        : this.childRepository.findOne({
            where: { id: recipientId },
            relations: ['affiliate'],
          }),
    ]);

    // Validaciones esenciales
    if (!status) throw new NotFound('Estado no encontrado.');
    if (!delegateBenefit) throw new NotFound('No hay unidades disponibles.');
    if (!recipientTypeEntity)
      throw new NotFound('Tipo de destinatario inválido.');
    if (existingDistribution) throw new BadRequest('Beneficio ya entregado.');
    if (!recipient) {
      throw new NotFound(
        `No encontramos al ${recipientType === 1 ? 'afiliado' : 'niño'}.`,
      );
    }

    // Validar afiliado si el destinatario es un niño
    const affiliate =
      recipientType === 1
        ? { id: recipientId }
        : { id: (recipient as Child).affiliate?.id };

    if (recipientType !== 1 && !affiliate.id)
      throw new BadRequest('El niño no tiene un afiliado asociado.');

    // Validar stock si se requiere
    if (
      this.takeStates.includes(status.id) &&
      delegateBenefit.quantity < quantity
    )
      throw new BadRequest(
        `Stock insuficiente. Disponible: ${delegateBenefit.quantity} unidades.`,
      );

    // Actualizar cantidad si aplica
    if (this.takeStates.includes(status.id))
      delegateBenefit.quantity -= quantity;

    // Ajustar cantidad y mensaje según el estado
    if (this.giveStates.includes(status.id)) dto.quantity = 0;

    const statusMessages: Record<number, string> = {
      4: 'Hubo un problema con la entrega.',
      5: 'La entrega fue cancelada.',
      6: 'Entrega en espera.',
    };

    const message =
      statusMessages[status.id] || '¡Entrega registrada con éxito!';

    // Transacción para guardar cambios
    return this.dataSource.transaction(async (manager) => {
      await manager.save(delegateBenefit);

      const distribution = manager.create(BenefitDistribution, {
        ...dto,
        status: { id: statusId },
        benefit: delegateBenefit.benefit,
        recipientType: recipientTypeEntity,
        ...(recipientType === 1
          ? { affiliate: { id: recipientId } }
          : { child: { id: recipientId }, affiliate }),
      });

      await manager.save(distribution);
      return { status: true, message, data: null };
    });
  }

  async getDistributionById(
    id: string,
  ): Promise<Response<SafeBenefitDistribution>> {
    const distribution = await this.distributionRepository.findOne({
      where: { id },
      relations: ['status', 'recipientType', 'benefit', 'affiliate', 'child'],
    });

    if (!distribution) throw new NotFound('La distribución no existe.');

    const delegateBenefit = await this.delegateBenefitRepository.findOne({
      where: { benefit: { id: distribution.benefit.id } },
      relations: ['delegate'],
    });

    if (!delegateBenefit) throw new NotFound('El delegado asignado no existe.');

    // Función para asegurar un objeto SafeAffiliate válido
    const toSafeAffiliate = (
      affiliate: Affiliate | null,
    ): SafeAffiliate | null => {
      if (!affiliate) return null;

      const safeAffiliate = omit(affiliate, [
        'dni',
        'createdAt',
        'updatedAt',
        'isActive',
        'contact',
        'address',
        'note',
      ]) as SafeAffiliate;

      if (!safeAffiliate.id)
        throw new Error('El ID del afiliado es obligatorio.');

      return safeAffiliate;
    };

    // Función para asegurar un objeto SafeChild válido
    const toSafeChild = (child: Child | null): SafeChild | null => {
      if (!child) return null;
      return omit(child, [
        'dni',
        'createdAt',
        'updatedAt',
        'note',
      ]) as SafeChild;
    };

    const distributionData = omit(distribution, ['updatedAt', 'createdAt']);
    const benefitData = omit(distribution.benefit, [
      'createdAt',
      'updatedAt',
      'stock',
    ]) as SafeBenefit;

    const delegateData = omit(delegateBenefit.delegate, [
      'dni',
      'createdAt',
      'updatedAt',
      'isActive',
    ]) as SafeDelegate;

    const affiliateData = toSafeAffiliate(distribution.affiliate);
    const childData = toSafeChild(distribution.child!);

    // Construir la respuesta segura
    const result: SafeBenefitDistribution = {
      ...distribution,
      benefit: benefitData,
      delegate: delegateData,
      affiliate: affiliateData,
      child: childData,
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
  ): Promise<Response<null>> {
    const { benefitId, recipientId, recipientType, statusId, quantity, notes } =
      dto;

    // Obtener entidades necesarias
    const distribution = await this.distributionRepository.findOne({
      where: { id },
      relations: ['benefit', 'status', 'affiliate', 'child'],
    });

    const benefit = await this.delegateBenefitRepository.findOne({
      where: { benefit: { id: benefitId } },
    });

    const recipientTypeEntity = await this.recipientTypeRepository.findOne({
      where: { id: recipientType },
    });

    if (!distribution || !benefit || !recipientTypeEntity) {
      throw new NotFound('Datos no encontrados o inválidos.');
    }

    // Validar stock según estado
    if (this.takeStates.includes(statusId!) && benefit.quantity < quantity!) {
      throw new BadRequest(
        `Stock insuficiente. Disponible: ${benefit.quantity}.`,
      );
    }

    if (
      this.giveStates.includes(statusId!) &&
      distribution.quantity < quantity!
    ) {
      throw new BadRequest(
        `Cantidad insuficiente. Disponible: ${distribution.quantity}.`,
      );
    }

    // Ajustar stock
    if (this.takeStates.includes(statusId!)) {
      benefit.quantity -= quantity!;
      distribution.quantity += quantity!;
    }

    if (this.giveStates.includes(statusId!)) {
      benefit.quantity += quantity!;
      distribution.quantity -= quantity!;
    }

    // Obtener destinatario según el tipo
    const recipient =
      recipientType === 1
        ? await this.affiliateRepository.findOne({ where: { id: recipientId } })
        : await this.childRepository.findOne({ where: { id: recipientId } });

    if (!recipient) {
      throw new NotFound('El destinatario no existe.');
    }

    // Manejar afiliación si el destinatario es un niño
    let affiliate: Affiliate | null = distribution.affiliate ?? null;
    if (recipientType === 2 && !affiliate) {
      affiliate = await this.affiliateRepository.findOne({
        where: { id: recipient.id },
      });

      if (!affiliate) {
        throw new NotFound('El niño no tiene un afiliado responsable.');
      }
    }

    // Actualizar destinatario y relaciones
    distribution.child = recipientType === 2 ? (recipient as Child) : undefined;
    distribution.affiliate =
      recipientType === 1 ? (recipient as Affiliate) : affiliate;

    // Actualizar distribución
    Object.assign(distribution, {
      recipientType: recipientTypeEntity,
      status: statusId
        ? ({ id: statusId } as DeliveryStatus)
        : distribution.status,
      notes,
      quantity: Math.max(distribution.quantity, 0),
    });

    // Guardar cambios en transacción
    await this.dataSource.transaction(async (manager) => {
      await manager.save(benefit);
      await manager.save(distribution);
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
      if (this.takeStates.includes(status.id)) {
        const delegateBenefit = await this.delegateBenefitRepository.findOne({
          where: { benefit: { id: benefit.id } },
        });

        if (delegateBenefit) {
          delegateBenefit.quantity += quantity;
          await manager.save(delegateBenefit);
        }
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

  async paginateBenefitDistribution(
    paginationDto: PaginationBenefitDeliveryDto,
  ): Promise<ResponseList<SafeBenefitDistribution>> {
    const {
      page,
      limit,
      search,
      order = SortOrder.ASC,
      statusId,
      recipientType,
    } = paginationDto;

    const currentPage = Math.max(1, page);
    const currentLimit = Math.max(1, limit);

    // Filtro de búsqueda simplificado
    const where: FindOptionsWhere<BenefitDistribution> = {
      ...(search && {
        [recipientType === 1 ? 'affiliate' : 'child']: {
          name: ILike(`%${search}%`),
        },
      }),
      ...(statusId && { status: { id: statusId } }),
      ...(recipientType && { recipientType: { id: recipientType } }),
    };

    // Construcción del query con joins dinámicos
    const queryBuilder = this.distributionRepository
      .createQueryBuilder('distribution')
      .leftJoinAndSelect('distribution.status', 'status')
      .leftJoinAndSelect('distribution.benefit', 'benefit')
      .leftJoinAndSelect('distribution.affiliate', 'affiliate')
      .leftJoinAndSelect('distribution.child', 'child')
      .where(where);

    // Ejecutar la consulta con paginación
    const [data, count] = await queryBuilder
      .skip((currentPage - 1) * currentLimit)
      .take(currentLimit)
      .orderBy(
        'distribution.createdAt',
        order === SortOrder.ASC ? 'ASC' : 'DESC',
      )
      .getManyAndCount();

    // Transformar los datos según el recipientType
    const filteredData = data.map((distribution) => {
      const baseData = {
        ...distribution,
        benefit: omit(distribution.benefit, [
          'updatedAt',
          'createdAt',
        ]) as SafeBenefit,
        delegate: {} as SafeDelegate,
      };

      if (recipientType === 1) {
        // Solo el afiliado si es tipo 1
        return {
          ...baseData,
          affiliate: distribution.affiliate
            ? (omit(distribution.affiliate, [
                'dni',
                'updatedAt',
                'createdAt',
                'isActive',
                'contact',
                'address',
                'note',
              ]) as SafeAffiliate)
            : null,
          child: null,
        };
      } else if (recipientType === 2) {
        // Afiliado + hijo si es tipo 2
        return {
          ...baseData,
          affiliate: distribution.affiliate
            ? (omit(distribution.affiliate, [
                'dni',
                'updatedAt',
                'createdAt',
                'isActive',
                'contact',
                'address',
                'note',
              ]) as SafeAffiliate)
            : null,
          child: distribution.child
            ? (omit(distribution.child, [
                'dni',
                'updatedAt',
                'createdAt',
                'note',
              ]) as SafeChild)
            : null,
        };
      }

      return baseData; // Retorno por defecto (si no hay recipientType válido)
    }) as SafeBenefitDistribution[];

    return Paginator.Format(
      filteredData,
      count,
      currentPage,
      currentLimit,
      search,
      order,
    );
  }
}
