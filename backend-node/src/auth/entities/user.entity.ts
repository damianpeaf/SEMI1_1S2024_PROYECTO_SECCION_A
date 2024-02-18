import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')

export class User {
    // nickname, name, password, photo

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', { length: 255, nullable: false })
    nickname: string;

    @Column('varchar', { length: 255, nullable: false })
    name: string;

    @Column('varchar', { length: 255, nullable: false })
    password: string;

    @Column('bytea', { nullable: true })
    photo: Buffer;
}