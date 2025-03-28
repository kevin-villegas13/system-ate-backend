import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('event_types')
export class EventType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true, name: 'type_name' })
  typeName: string;
}
