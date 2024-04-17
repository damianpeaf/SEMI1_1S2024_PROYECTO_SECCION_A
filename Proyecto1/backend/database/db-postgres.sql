CREATE EXTENSION IF NOT EXISTS citext;

DROP TABLE IF EXISTS "user";
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    username citext NOT NULL UNIQUE,
    name varchar(255) NOT NULL,
    password char(32) NOT NULL,
);


DROP TABLE IF EXISTS project;
CREATE TABLE project (
    id SERIAL PRIMARY KEY,
    title varchar(255) NOT NULL,
    description text NOT NULL,
    date_created timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    location varchar(255) NOT NULL,
    category varchar(255) NOT NULL,
)

DROP TABLE IF EXISTS project_extra;
CREATE TABLE project_extra (
    id SERIAL PRIMARY KEY,
    project_id int NOT NULL,
    notes text NOT NULL,
    image_url varchar(255) NOT NULL,
    extra_type varchar(255) NOT NULL,
    FOREIGN KEY (project_id) REFERENCES project(id)
)

DROP TABLE IF EXISTS privilege;
CREATE TABLE privilege (
    id SERIAL PRIMARY KEY,
    name varchar(255) NOT NULL
)

DROP TABLE IF EXISTS role;
CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    privilege_id int NOT NULL,
    name varchar(255) NOT NULL
    FOREIGN KEY (privilege_id) REFERENCES privilege(id)
)

DROP TABLE IF EXISTS project_user;
CREATE TABLE project_user (
    id SERIAL PRIMARY KEY,
    project_id int NOT NULL,
    user_id int NOT NULL,
    role_id int NOT NULL,
    FOREIGN KEY (project_id) REFERENCES project(id),
    FOREIGN KEY (user_id) REFERENCES "user"(id),
    FOREIGN KEY (role_id) REFERENCES role(id)
)

DROP TABLE IF EXISTS task;
CREATE TABLE task (
    id SERIAL PRIMARY KEY,
    project_id int NOT NULL,
    state varchar(255) NOT NULL,
    image_url varchar(255) NOT NULL,
    notes text NOT NULL,
    FOREIGN KEY (project_id) REFERENCES project(id)
)