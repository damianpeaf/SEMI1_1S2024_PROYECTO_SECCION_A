import { Rekognition } from 'aws-sdk';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('citext')
  username: string;

  @Column('varchar', { length: 255, nullable: false })
  name: string;

  @Column('char', { length: 32, nullable: false })
  password: string;

  @Column('text', { nullable: true, name: 'photo_url' })
  photoUrl: string;

  @Column('jsonb', { nullable: true })
  faceDescriptor: Rekognition.Labels;
}
