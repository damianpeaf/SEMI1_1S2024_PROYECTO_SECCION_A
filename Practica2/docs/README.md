# Práctica 2

## Universidad de San Carlos de Guatemala

## Seminario de Sistemas 1

### Grupo 6


| **Nombre**                 	| **Carné** 	|
|----------------------------	|-----------	|
| Daniel Estuardo Cuque Ruíz 	| 202112145 	|
| Damián Ignacio Peña Afre   	| 202110568 	|
| Jeser Emanuel Rodas Medina 	| 202105561 	|

### Diagrama de la arquitectura	

<img src="./assets/arch-diagram.png" alt="drawing" width="500" />

Se accede a la app web pública que está alojada en un bucket S3, esta pagina envia las request hacia la API que está alojada en una instancia EC2; se encarga de procesar la petición y, según lo requerido, obtiene, escribe o manipula información en la base de datos, así como también crea u obtiene imagenes del bucket dedicado a las imagenes. También accede a los servicios utilizados de Amazon AWS como Amazon Lex, Rekognition, etc.


### Buckets de S3

- Listado de folders en el bucket

<img src="./assets/s3-folders.jpg" alt="drawing" width="200"/>

- Contenido de la página web en el bucket

<img src="./assets/s3-webpage.jpg" alt="drawing" width="200"/>

- Listado de instancias

<img src="./assets/s3-instances.jpg" alt="drawing" width="200"/>

### Instancia de EC2

- Instancia de EC2

<img src="./assets/instance-ec2.jpg" alt="drawing" width="200"/>


### Base de datos RDS

- Instancia de base de datos

<img src="./assets/rds-db.jpg" alt="drawing" width="200"/>

### Página web

<img src="./assets/web1.png" alt="drawing" width="200"/>

<img src="./assets/web2.png" alt="drawing" width="200"/>


[Link de la página web](http://practica1-g6-paginaweb.s3-website-us-east-1.amazonaws.com/dashboard/)

### IAM

- Grupos de usuarios

<img src="./assets/iam-user-groups.jpg" alt="drawing" width="200"/>

- S3

<img src="./assets/iam-s3.jpg" alt="drawing" width="200"/>

- EC2

<img src="./assets/iam-ec2.jpg" alt="drawing" width="200"/>

- RDS

<img src="./assets/iam-rds.jpg" alt="drawing" width="200"/>

- Rekognition

<img src="./assets/iam-rekognition.jpg" alt="drawing">

- Lex

<img src="./assets/iam-lex.jpg" alt="drawing">

- Translate

<img src="./assets/iam-translate.jpg" alt="drawing">

## Funcionalidades de Chatbot

- Agenda de una cita
- Preguntas frecuentes
- Consulta de saldo disponible