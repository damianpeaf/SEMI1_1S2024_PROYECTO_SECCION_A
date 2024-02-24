import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'photo' })
export class AlbumPhoto {
    @PrimaryGeneratedColumn()
    id: string;

    @Column('varchar', { length: 255, nullable: false })
    name: string;

    @Column('text', { nullable: false })
    url: string;

    @Column('integer', { nullable: false, name: 'album' })
    albumId: number;
}