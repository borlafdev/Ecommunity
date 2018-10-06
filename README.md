# Tu primera aplicación con Ethereum
Esta aplicación simula un sistema de votaciones en el cual cada cuenta de ethereum solo puede votar una vez por su equipo favorito. Durante el tutorial se explicarán los conceptos básicos de la arquitectura de Ethereum, además de las funcionalidades de los paquetes básicos que necesitaremos, entre los que se encuentran Truffle, Ganache y Metamask.

## Dependencias
Es necesario instalar los siguientes prerrequisitos para poder seguir el desarrollo de la aplicación.
- **NPM**: es el gestor de paquetes por defecto de Node.js https://nodejs.org
- **Truffle**: es el entorno de desarrollo o framework más famoso para Ethereum que tiene como objetivo facilitar el trabajo a los desarrolladores.
```sh
$ npm install -g truffle
```
- **Ganache**: red local que sirve para desarrollar aplicaciones en Ethereum en ella podremos hacer nuestras pruebas.  http://truffleframework.com/ganache/
- **Metamask**: podría considerarse como un puente entre Ethereum y tu navegador sin comprometer tu seguridad https://metamask.io/

## 1. Clonamos el respositorio
Vamos a clonar el repositorio de GitHub
```sh
$ git clone https://github.com/KairosDS/etsit-ethereum-truffle
```

Podemos observar que se ha creado la siguiente estructura de directorios:
    .
    ├── build                   
    ├── contracts               
    ├── migrations                    
    ├── src                             # Parte de aplicación cliente
    ├── test                   
    ├── bs-config.json                 
    ├── package-lock.json 
    ├── package.json                  
    ├── truffle.js                      # Archivo configuración principal de Truffle
    └── README.md
    
 **Contracts**: Aquí es donde viven los Smart Contracts. Ya existe un Migration Contract que controla nuestras migraciones a la Blockchain.
 **Migrations**: Aquí es donde viven todos los archivos de migración. Estas migraciones son similares a otros frameworks de desarrollo que requieren migraciones para cambiar el estado de la base de datos. Cada vez que desplegamos Smart Contracts en la blockchain, estamos actualizando su estado por lo que necesitaremos una migración.

## 2. Instalar las dependencias
```
$ npm install
```
## 3. Ganache
Una vez hayamos descargado Ganache, abrimos su interfaz gráfica donde podremos encontrar 
- 10 cuentas generadas para interactuar con la Blockchain. Para cada una apareceran su clave privada y su dirección de Ethereum. También muestran el saldo y las transacciones de cada una.
- Explorador de bloques y transacciones.
- Logs para ver en detalle el funcionamiento del sistema.

Dentro de la pestaña de confuguración podemos elegir el PORT NUMBER, es importante configurar el Web3 provider en el archivo de *src/app.js* para que esten en la misma red. Tambien tiene que estar  indicado en el archivo de configuración de truffle. En este repositorio es 8545.

## 4.Election.sol
En este contrato se define la lógica de la aplicación. Si nos metemos en dicho documento encontramos una breve explicación de como se programa en Solidity, lenguaje similar a JavaScript.
De este contrato podemos destacar lo siguiente:
- Se define una estructura **'Candidate'** para que todos los candidatos tengan los mismos parámetros.
- Se definen dos *mapping*, uno con los candidatos **candidates** cuya clave es el indice y su valor es el candidato y otro con los votantes **voters** cuya clave es su *address* y el valor si han votado o no.
- Una variable pública **candidatesCount** con el número de candidatos que han votado.
- Un evento para saber cuando se ha realizado una votación **votedEvent**.
- La función **addCandidate(string _name)** que crea un nuevo candidato.
- La función **vote(uint _candidateID)** que comprueba que la cuenta que llama al contrato no ha votado previamente y le deja votar al candidato que consideren según su id.

## 5. Compilar y desplegar Smart Contracts
### 2_deploy_contracts.js
```js
var Election = artifacts.require("./Election.sol");
module.exports = function(deployer) {
  deployer.deploy(Election);
};
```
Se encuentra dentro del directorio Migrations.
Tenemos que numerar todos los archivos que haya dentro del directorio de Migrations para que Truffle sepa cual es el orden en el que debe ejecutarlos.
Una vez hecho esto ya podemos migrar los contratos a la red. Debemos hacerlo cada vez que reiniciemos Ganache.
```js
$ truffle migrate --reset
```
Hacemos *--reset* porque se genera un archivo json por cada contrato creado, por lo que si se reinicia la red, tendremos que volver a generar unos nuevos.

### Consola
Podemos probar las funcionalidades de nuestro contrato sin necesidad de tener que desarrollar un front. Lo haremos a traves de la consola de Truffle.
Una vez hemos migrado nuestro Smart Contract a la red local de Ethereum, abrimos la consola para interactuar con el Smart Contract.
```js
$ truffle console 
```
Por ejemplo, si queremos saber cuantos candidatos están definidos escribimos lo siguiente en la consola
```js
> Election.deployed().then(function(instance) { app = instance })
> app.candidatesCount()
```
La función **deployed()** recupera la instancia desplegada en el contrato y se le asigna una variable de aplicación dentro de la función **app**. Por tanto la segunda sentencia, devuelve el valor de la variable **candidatesCount()** que vive en la blockchain.

Otra funcionalidad por ejemplo que se puede probar desde la consola es la de votar: 

 ```js
 > Election.deployed().then((instance) => {return instance.vote(2, {from: '0x1a016be703c32066486f752364f18dec49528725'})}).then((res) => {console.log(res)})
 ```
 
Podeis encontrar más información de como interactuar con el contrato a traves de la consola en el siguiente enlace:
https://truffleframework.com/docs/truffle/getting-started/interacting-with-your-contracts

## 6.Test
En Ethereum los tests tienen bastante peso al desarrollar los Smart Contracts, ya que hay que tener en cuenta que el código en la blockchain de Ethereum es inmutable, si hay algún fallo habrá que desplegar una nueva copia que no tendrá el mismo estado que la antigua, ni la misma dirección. También el hecho de que el despliegue de contratos implica un coste de gas porque crea transacciones y escribe datos en la blockchain. 
Los vamos a definir con JavaScript. Para pasarlos a nuestro código escribimos por linea de comandos el siguiente:
```js
 	$ truffle test
 ```
## 7. Metamask
Una vez hayamos añadido la extensión de Metamask a Google Chrome tendremos que crearnos una cuenta y conectar Metamask a nuestra red local de Ethereum que nos proporciona Ganache (En nuestro caso HTTP://127.0.0.1:8545). 
Por último importamos las cuentas que ha generado Ganache.

## 8. Ejecutamos la aplicación
```js
$ npm run dev
```
En tu navegador ` http://localhost:3000`
A la hora de trabajar con la aplicación desde el navegador, es conveniente que probemos r todas las funcionalidades que se han implementado en el Smart Contract, es decir, que una vez votas desde una cuenta de Ethereum no puedes volver a votar, y que al cambiar de cuenta y votar se va guardando la clasificación.








# Ecommunity
