import { ConflictException, Injectable } from '@nestjs/common';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { Child } from './entities/child.entity';
import { Affiliate } from 'src/affiliates/entities/affiliate.entity';
import { Gender } from 'src/genders/entities/gender.entity';
import { Response } from 'src/common/response/response.type';
import { NotFound } from 'src/common/exceptions';
import { Paginator } from 'src/common/paginator/paginator.helper';
import {
  ResponseList,
  SortOrder,
} from 'src/common/paginator/type/paginator.interface';
import { PaginationChildrenDto } from './dto/paginador-children.dto';
import { omit } from 'lodash';
import {
  ChildDto,
  OmitAffiliate,
  OmitChild,
  OmitGender,
} from './dto/child-omit-fields.dto';

@Injectable()
export class ChildrenService {
  constructor(
    @InjectRepository(Child)
    private readonly childRepository: Repository<Child>,

    @InjectRepository(Affiliate)
    private readonly affiliateRepository: Repository<Affiliate>,

    @InjectRepository(Gender)
    private readonly genderRepository: Repository<Gender>,
  ) {}

  async create(createChildDto: CreateChildDto): Promise<Response<null>> {
    const { affiliateId, genderId, dni, ...childrenData } = createChildDto;

    const [affiliate, gender, existingChild] = await Promise.all([
      this.affiliateRepository.findOne({ where: { id: affiliateId } }),
      this.genderRepository.findOne({ where: { id: genderId } }),
      this.childRepository.findOne({ where: { dni: dni } }),
    ]);

    if (!affiliate)
      throw new NotFound(
        `No encontramos al afiliado que mencionaste. Por favor, revisa el nombre y vuelve a intentarlo.`,
      );

    if (!gender)
      throw new NotFound(
        `No encontramos el género que especificaste. Asegúrate de haber seleccionado correctamente.`,
      );

    if (existingChild)
      throw new ConflictException(
        `El DNI ${dni} ya está registrado. Verifica los datos e intenta nuevamente.`,
      );

    const child = this.childRepository.create({
      ...childrenData,
      affiliate,
      gender,
    });

    await this.childRepository.save(child);

    return {
      status: true,
      message: `¡El niño/a ${child.firstName} ${child.lastName} se ha registrado con éxito!`,
      data: null,
    };
  }

  async update(
    id: string,
    updateChildDto: UpdateChildDto,
  ): Promise<Response<null>> {
    const child = await this.childRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!child)
      throw new NotFound(
        `No encontramos a este niño en el sistema. Verifica el nombre e intenta nuevamente.`,
      );

    Object.assign(child, updateChildDto);

    await this.childRepository.save(child);

    return {
      status: true,
      message: `¡Los datos de ${child.firstName} ${child.lastName} han sido actualizados correctamente!`,
      data: null,
    };
  }

  async remove(id: string): Promise<Response<null>> {
    const child = await this.childRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!child)
      throw new NotFound(
        `No encontramos al niño/a con el nombre o información proporcionada. Por favor, revisa e intenta nuevamente.`,
      );

    await this.childRepository.remove(child);

    return {
      status: true,
      message: `El registro del niño/a ha sido eliminado correctamente.`,
      data: null,
    };
  }

  async paginateChildren(
    paginationDto: PaginationChildrenDto,
  ): Promise<ResponseList<ChildDto>> {
    const {
      page,
      limit,
      search,
      order = SortOrder.ASC,
      genderId,
    } = paginationDto;

    const where: FindOptionsWhere<Child> = {
      ...(search && { firstName: ILike(`%${search}%`) }),
      ...(genderId && { gender: { id: genderId } }),
    };

    const [data, count] = await this.childRepository.findAndCount({
      where,
      relations: ['gender'],
      order: { firstName: order },
      skip: (page - 1) * limit,
      take: limit,
    });

    const reducedData = data.map(({ gender, ...child }) => ({
      ...omit(child, ['createdAt', 'updatedAt', 'note']),
      gender: omit(gender, ['createdAt', 'updatedAt']) as OmitGender,
    }));

    return Paginator.Format(reducedData, count, page, limit, search, order);
  }

  async findChildById(childId: string): Promise<Response<ChildDto>> {
    const child = await this.childRepository.findOne({
      where: { id: childId },
      relations: ['gender'],
    });

    if (!child) throw new NotFound('Niño no encontrado');

    const reducedData: ChildDto = {
      ...omit(child, ['createdAt', 'updatedAt', 'note']),
    };

    return {
      status: true,
      message: 'Información del niño obtenida correctamente.',
      data: reducedData,
    };
  }

  async findChildrenByAffiliateId(
    affiliateId: string,
  ): Promise<Response<OmitAffiliate>> {
    const affiliate = await this.affiliateRepository.findOne({
      where: { id: affiliateId },
      relations: ['children', 'children.gender'],
    });

    if (!affiliate) throw new NotFound('Afiliado no encontrado');

    if (affiliate.children.length === 0)
      throw new NotFound('No se encontraron niños asociados a este afiliado.');

    const reducedAffiliate: OmitAffiliate = {
      ...omit(affiliate, ['note', 'createdAt', 'updatedAt', 'contact']),
      children: affiliate.children.map((child) => ({
        ...omit(child, [
          'createdAt',
          'updatedAt',
          'note',
          'affiliate',
          'updateAge',
        ]),
        gender: omit(child.gender, ['createdAt', 'updatedAt']) as OmitGender,
      })) as OmitChild[],
    };

    return {
      status: true,
      message: `Se encontraron ${affiliate.children.length} niños/as asociados a este afiliado.`,
      data: reducedAffiliate,
    };
  }
}
