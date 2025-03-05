import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('recipient_types')
export class RecipientType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50, name: 'type_name' })
  typeName: string;
}
