import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { RecipientType } from './enums/recipient-type.enum';

@Entity('recipients')
export class Recipient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    unique: true,
    nullable: false,
    enum: RecipientType,
  })
  type: RecipientType;
}
