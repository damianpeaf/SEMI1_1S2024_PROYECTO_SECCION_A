import { Column, Entity } from "typeorm";

export enum EAlbumType {
    STANDARD = 1,
    PROFILE = 2,
}

@Entity({ name: 'album_type' })
export class AlbumType {
    id: number;
    
    @Column('varchar', { length: 255, nullable: false })
    name: string;
}