import { Injectable, OnModuleInit } from '@nestjs/common';
import { Sector } from './entities/sector.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SectorsService implements OnModuleInit {
  constructor(
    @InjectRepository(Sector)
    private readonly sectorRepository: Repository<Sector>,
  ) {}

  async onModuleInit() {
    const sectors = [
      { name: 'ANSES', sectorName: 'ANSES', sectorCode: 'B020N0501100' },
      { name: 'A.R.B.A.', sectorName: 'ARBA', sectorCode: 'B020P0710000' },
      {
        name: 'JEF.ASES. DEL GOBERNADOR',
        sectorName: 'JEF. ASES.',
        sectorCode: 'B020P1300000',
      },
      {
        name: 'PATRONATO DE LIBERADOS',
        sectorName: 'LIBERADOS',
        sectorCode: 'B020P1100000',
      },
      {
        name: 'SUB-SEC. TRABAJO',
        sectorName: 'TRABAJO',
        sectorCode: 'B020P1200000',
      },
      {
        name: 'I.N.S.S.J.Y.P.-PAMI-',
        sectorName: 'PAMI',
        sectorCode: 'B020N1220004',
      },
      {
        name: 'CONS. PCIAL. DEL MENOR',
        sectorName: 'MENOR',
        sectorCode: 'B020P2000000',
      },
      {
        name: 'MIN.SALUD PUBLICA',
        sectorName: 'SALUD',
        sectorCode: 'B020P2300000',
      },
      {
        name: 'SECRETARIA DE ADICCIONES',
        sectorName: 'ADICCIONES',
        sectorCode: 'B020P2310000',
      },
      {
        name: 'HOSPITAL ANA GOITIA',
        sectorName: 'ANA GOITIA',
        sectorCode: 'B020P2302002',
      },
      {
        name: 'HOSPITAL PTE PERON',
        sectorName: 'PTE PERON',
        sectorCode: 'B020P2302004',
      },
      {
        name: 'HOSPITAL FIORITO',
        sectorName: 'FIORITO',
        sectorCode: 'B020P2302005',
      },
      {
        name: 'MUNICIP. AVELLANEDA',
        sectorName: 'AVELLANEDA',
        sectorCode: 'B020M0307002',
      },
      { name: 'I.O.M.A', sectorName: 'IOMA', sectorCode: 'B020P2402027' },
      {
        name: 'CAMARA DE DIPUTADOS',
        sectorName: 'DIPUTADOS',
        sectorCode: 'B020PL000001',
      },
      {
        name: 'CAMARA DE SENADORES',
        sectorName: 'SENADORES',
        sectorCode: 'B020PL000003',
      },
    ];

    for (const sector of sectors) {
      const exists = await this.sectorRepository.findOne({
        where: { sectorCode: sector.sectorCode },
      });

      if (!exists) {
        const newSector = this.sectorRepository.create(sector);
        await this.sectorRepository.save(newSector);
      }
    }
  }

  async getAllSectors(): Promise<Sector[]> {
    return this.sectorRepository.find();
  }
}
