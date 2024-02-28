import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

    @Column('date', { nullable: true })
    deleted_at: string;
}
