import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sectors')
export class Sector {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true, name: 'sector_name', length: 50 })
  sectorName: string;

  @Column({ unique: true, name: 'sector_code', length: 12 })
  sectorCode: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
