import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'photo_album' })
export class PhotoAlbum {
    @PrimaryGeneratedColumn()
    id: string;

    @Column('integer', { nullable: false, name: 'photo_id' })
    photoId: number;

    @Column('integer', { nullable: false, name: 'album_id' })
    albumId: number;
}