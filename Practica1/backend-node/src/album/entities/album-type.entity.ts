import { Column, Entity, PrimaryColumn } from 'typeorm';

export enum EAlbumType {
  PROFILE = 1,
  STANDARD = 2,
}

@Entity({ name: 'album_type' })
export class AlbumType {
  @PrimaryColumn()
  id: number;

  @Column('varchar', { length: 255, nullable: false })
  name: string;
}
