import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { CreateDelegateDto } from './dto/create-delegate.dto';
import { UpdateDelegateDto } from './dto/update-delegate.dto';
import { PaginationDelegatesDto } from './dto/paginador-delegatedto';
import { Delegate } from './entities/delegate.entity';
import { Response } from '../common/response/response.type';
import { Conflict, NotFound } from '../common/exceptions';
import {
  ResponseList,
  SortOrder,
} from '../common/paginator/type/paginator.interface';
import { Paginator } from '../common/paginator/paginator.helper';

@Injectable()
export class DelegatesService {
  constructor(
    @InjectRepository(Delegate)
    private readonly delegateRepository: Repository<Delegate>,
  ) {}

  async create(
    createDelegateDto: CreateDelegateDto,
    userId: string,
  ): Promise<Response<null>> {
    const { dni } = createDelegateDto;

    const existingDelegate = await this.delegateRepository.findOne({
      where: { dni: dni },
    });

    if (existingDelegate)
      throw new Conflict('Ya existe un delegado con este DNI.');

    const delegate = this.delegateRepository.create({
      ...createDelegateDto,
      user: { id: userId },
    });

    await this.delegateRepository.save(delegate);

    return {
      status: true,
      message: 'Delegado creado',
      data: null,
    };
  }

  async paginateDelegates(
    paginationDto: PaginationDelegatesDto,
  ): Promise<ResponseList<Delegate>> {
    const {
      page = 1,
      limit = 10,
      search,
      order = SortOrder.ASC,
      sectorId,
    } = paginationDto;

    const currentPage = Math.max(1, page);
    const currentLimit = Math.max(1, limit);

    const where: FindOptionsWhere<Delegate> = {
      ...(sectorId && { sector: { id: sectorId } }),
      ...(search && [
        { firstName: ILike(`%${search}%`) },
        { lastName: ILike(`%${search}%`) },
        { dni: ILike(`%${search}%`) },
      ]),
    };

    const [data, count] = await this.delegateRepository.findAndCount({
      where,
      relations: ['sector'],
      order: { firstName: order },
      skip: (currentPage - 1) * currentLimit,
      take: currentLimit,
    });

    return Paginator.Format(
      data,
      count,
      currentPage,
      currentLimit,
      search,
      order,
    );
  }

  async findOne(id: string): Promise<Response<Delegate>> {
    const delegate = await this.delegateRepository.findOne({
      where: { id },
      relations: ['sector', 'user'],
    });

    if (!delegate)
      throw new NotFound(`No se encontró un delegado con el ID ${id}.`);

    return {
      status: true,
      message: 'Delegado encontrado.',
      data: delegate,
    };
  }

  async update(
    id: string,
    updateDelegateDto: UpdateDelegateDto,
  ): Promise<Response<null>> {
    const existingDelegate = await this.delegateRepository.findOne({
      where: { id },
    });

    if (!existingDelegate)
      throw new NotFound('No se encontró el delegado que deseas actualizar.');

    if (
      updateDelegateDto.dni &&
      updateDelegateDto.dni !== existingDelegate.dni
    ) {
      const duplicateDni = await this.delegateRepository.findOne({
        where: { dni: updateDelegateDto.dni },
      });

      if (duplicateDni)
        throw new Conflict(
          'Ya existe otro delegado con este número de documento.',
        );
    }

    await this.delegateRepository.update(id, updateDelegateDto);

    return {
      status: true,
      message: 'Delegado actualizado con éxito.',
      data: null,
    };
  }

  async remove(id: string): Promise<Response<null>> {
    const existingDelegate = await this.delegateRepository.findOne({
      where: { id },
    });

    if (!existingDelegate)
      throw new NotFound('No se encontró el delegado que deseas eliminar.');

    await this.delegateRepository.delete(id);

    return {
      status: true,
      message: 'El delegado se eliminó correctamente.',
      data: null,
    };
  }
}
