import { Column, PrimaryGeneratedColumn } from "typeorm";

export class Album {
    @PrimaryGeneratedColumn()
    id: string;

    @Column('varchar', { length: 255, nullable: false })
    name: string;

    @Column('integer', { nullable: false })
    user: number;

    @Column('integer', { nullable: false })
    album_type: number;
}
