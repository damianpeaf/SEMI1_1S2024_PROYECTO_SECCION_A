# Práctica 1

## Universidad de San Carlos de Guatemala

## Seminario de Sistemas 1

### Grupo 6


| **Nombre**                 	| **Carné** 	|
|----------------------------	|-----------	|
| Daniel Estuardo Cuque Ruíz 	| 202112145 	|
| Damián Ignacio Peña Afre   	| 202110568 	|
| Jeser Emanuel Rodas Medina 	| 202105561 	|

### Diagrama de la arquitectura	

<img src="./assets/0.png" alt="drawing" width="500" />

Se accede a la app web pública que está alojada en un bucket S3, posteriormente el balanceador de carga envia las peticiones a alguna de las APIs que están alojadas en instancias EC2; las cuales se encargan de procesar la petición y, según lo requerido, obtienen, escriben o manipulan información en la base de datos, así como también crean u obtienen imagenes del bucket dedicado a las imagenes.


### Buckets de S3

- Listado de folders en el bucket

<img src="./assets/1.jpg" alt="drawing" width="200"/>

- Contenido de la página web en el bucket

<img src="./assets/3.jpg" alt="drawing" width="200"/>

- Listado de instancias

<img src="./assets/4.jpg" alt="drawing" width="200"/>

### Instancias de EC2

- Grupos destino de los balanceadores de carga

<img src="./assets/5.jpg" alt="drawing" width="200"/>

- Instancias de EC2

<img src="./assets/9.jpg" alt="drawing" width="200"/>

[DNS de el balanceador de cargas](http://balanceador-sds1-793954245.us-east-1.elb.amazonaws.com/check)

### Base de datos RDS

- Instancia de base de datos

<img src="./assets/7.jpg" alt="drawing" width="200"/>

### Página web usando el balanceador de cargas

<img src="./assets/11.png" alt="drawing" width="200"/>

<img src="./assets/12.png" alt="drawing" width="200"/>


[Link de la página web](http://practica1-g6-paginaweb.s3-website-us-east-1.amazonaws.com/dashboard/)

### IAM

- Grupos de usuarios

<img src="./assets/8.jpg" alt="drawing" width="200"/>

- S3

<img src="./assets/2.jpg" alt="drawing" width="200"/>

- EC2

<img src="./assets/6.jpg" alt="drawing" width="200"/>

- RDS

<img src="./assets/10.jpg" alt="drawing" width="200"/>
