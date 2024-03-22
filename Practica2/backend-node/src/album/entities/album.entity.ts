import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'album' })
export class Album {
  @PrimaryGeneratedColumn()
  id: string;

  @Column('varchar', { length: 255, nullable: false })
  name: string;

  @Column('integer', { nullable: false })
  user: number;

  @Column('integer', { nullable: false })
  album_type: number;

  @DeleteDateColumn({ nullable: true, name: 'deleted_at' })
  deleted_at: Date;
}
