import { Injectable } from '@nestjs/common';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Sector } from './entities/sector.entity';
import { CreateSectorDto } from './dto/create-sector.dto';
import { Conflict, NotFound } from '../common/exceptions';
import { UpdateSectorDto } from './dto/update-sector.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Response } from '../common/response/response.type';
import {
  ResponseList,
  SortOrder,
} from '../common/paginator/type/paginator.interface';
import { Paginator } from 'src/common/paginator/paginator.helper';

@Injectable()
export class SectorsService {
  constructor(
    @InjectRepository(Sector)
    private readonly sectorRepository: Repository<Sector>,
  ) {}

  async create(createSectorDto: CreateSectorDto): Promise<Response<null>> {
    const { name, sectorCode } = createSectorDto;

    const existSector = await this.sectorRepository.findOne({
      where: [{ name }, { sectorCode }],
    });

    if (existSector) throw new Conflict('El sector ya existe.');

    const sector = this.sectorRepository.create({ name, sectorCode });
    await this.sectorRepository.save(sector);

    return { status: true, message: 'Sector creado exitosamente.', data: null };
  }

  async getAllSectors(): Promise<Response<Sector[]>> {
    const sectors = await this.sectorRepository.find({
      select: ['id', 'name'],
    });

    return {
      status: true,
      message: 'Lista de sectores.',
      data: sectors,
    };
  }

  async paginationSectors(
    paginationDto: PaginationDto,
  ): Promise<ResponseList<Sector>> {
    const { page, limit, search, order = SortOrder.ASC } = paginationDto;

    const where: FindOptionsWhere<Sector> = {
      ...(search && { name: ILike(`%${search}%`) }),
      ...(search && { sectorCode: ILike(`%${search}%`) }),
    };

    const [data, count] = await this.sectorRepository.findAndCount({
      where,
      select: ['id', 'name', 'sectorCode'],
      order: { name: order, sectorCode: order },
      skip: (Math.max(1, page) - 1) * Math.max(1, limit),
      take: Math.max(1, limit),
    });

    return Paginator.Format(data, count, page, limit, search, order);
  }

  async findOne(id: number): Promise<Response<Sector>> {
    const sector = await this.sectorRepository.findOne({
      where: { id },
      select: ['id', 'name'],
    });

    if (!sector) throw new NotFound(`Sector con ID "${id}" no encontrado.`);

    return {
      status: true,
      message: 'Sector encontrado.',
      data: sector,
    };
  }

  async update(
    id: number,
    updateSectorDto: UpdateSectorDto,
  ): Promise<Response<Sector>> {
    const sector = await this.findOne(id);

    if (!sector.data)
      throw new NotFound(`Sector con ID "${id}" no encontrado.`);

    const { name, sectorCode } = updateSectorDto;

    if (name || sectorCode) {
      const duplicateSector = await this.sectorRepository.findOne({
        where: [{ name }, { sectorCode }],
      });
      if (duplicateSector && duplicateSector.id !== id) {
        throw new Conflict('El nombre o código ya está en uso.');
      }
    }

    Object.assign(sector.data, updateSectorDto);
    await this.sectorRepository.save(sector.data);

    return {
      status: true,
      message: 'Sector actualizado exitosamente.',
      data: sector.data,
    };
  }

  async remove(id: number): Promise<Response<null>> {
    const sector = await this.findOne(id);

    if (!sector.data)
      throw new NotFound(`Sector con ID "${id}" no encontrado.`);

    await this.sectorRepository.remove(sector.data);

    return {
      status: true,
      message: 'Sector eliminado exitosamente.',
      data: null,
    };
  }
}
