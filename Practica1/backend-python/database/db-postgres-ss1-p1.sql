CREATE EXTENSION IF NOT EXISTS citext;

drop table if exists "user";
create table "user" (
    id serial primary key,
    username citext not null unique,
    name varchar(255) not null,
    password char(32) not null,
    photo_url text
);

drop table if exists album_type;
create table album_type (
    id serial primary key,
    name varchar(255) not null
);

insert into album_type (name) values ('profile'), ('standard');

drop table if exists album;
create table album (
    id serial primary key,
    name varchar(255) not null,
    "user" integer not null references "user"(id),
    album_type integer not null references album_type(id),
    deleted_at timestamp default null
);

drop table if exists photo;
create table photo (
    id serial primary key,
    name varchar(255) not null,
    url text not null,
    album integer not null references album(id)
);