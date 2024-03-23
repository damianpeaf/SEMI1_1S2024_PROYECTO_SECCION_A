import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'photo' })
export class Photo {
  @PrimaryGeneratedColumn()
  id: string;

  @Column('varchar', { length: 255, nullable: false })
  name: string;

  @Column('text', { nullable: false })
  url: string;

  @Column('text', { nullable: false, name: 'description' })
  description: string;
}
