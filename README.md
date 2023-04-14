
# Diamond - A card-sorting and tree-testing application



## Introduction

Diamond is a web-based tool for information architects, which supports
both tree testing and card sorting. It is implemented using Angular as
its frontend, Node.js as its server, and MongoDB as its database.



## Features

- Registration and login.
- Create/edit/delete a study.
- Import an information hierarchy (tree) or set of cards as CSV.
- Launch/unlaunch a study.
- Perform a study.
- Analyse/view study results.
- Export study results as CSV.



## Requirements

- [Node.js v16 (Gallium)](https://nodejs.org/en/download/releases)
- [MongoDB v4](https://www.mongodb.com/docs/v4.4/installation/)

To manage your Node.js installation, it is recommended to use 
[NVM](https://github.com/nvm-sh/nvm) or 
[NVM-Windows](https://github.com/coreybutler/nvm-windows).
The required Node.js version is printed to the ```.nvmrc``` file.



## Architecture

The project is set up as a multi-package repository containing both
frontend and backend code. To seperate both code bases, npm workspaces 
are used. Currently, there are to workspaces: client (for frontend code)
and server (for backend code).



## Running Diamond locally

- Make sure to have the specified versions of Node.js and MongoDB 
  installed
- Create a local copy of the sample environment file 
  ```cp .env.sample .env``` and fill in admin account details and your 
  local MongoDB connection string. 
- Startup your local MongoDB
- In the project root folder run ```npm install``` to install all 
  dependencies
- In the project root folder run ```npm run build``` to build the 
frontend
- In the project root folder run ```npm start``` to start the 
  application

Open your browser and got to 
[http://localhost:8000](http://localhost:8000).

Instead of installing MongoDB locally, you can use a dockerized version.
To start the MongoDB docker container, go to ```/deploy/local``` and run
```docker-compose up -d```. This will start a MongoDB instance in the
background and can be accessed via 
```mongodb://localhost:27017/<database_name>```. Diamond is set up to
use this connection string as default, if no .env file is available.
Use ```docker-compose down``` to shut down MongoDB.


## Developing Diamond

The following npm scripts are available (run all of the from the 
project's root):

- To install all dependencies ```npm install```
- To only install the dependencies of a specific workspace 
  ```npm install -w client``` or ```npm install -w server```
- To start the frontend for development: ```npm start -w client```
- To start the backend for development: ```npm start -w server```
- To create a production frontend build: ```npm run build -w client``` 
  (the server's public directory is set to the client's build output 
  directory)

To run frontend and backend independently:

- Make sure to have Node.js and MongoDB installed
  (or use docker-compose)
- Create a local copy of the sample environment file 
  ```cp .env.sample .env``` and fill in admin account details and your 
  local MongoDB connection string. 
- Startup your local MongoDB
- In the project root folder run ```npm install``` to install all 
  dependencies
- In the project root folder run ```npm start -w server``` to start the
  backend. It will be available at 
  [http://localhost:8000](http://localhost:8000)
- In the project root folder run ```npm start -w client``` to start the
  frontend. It will be available at 
  [http://localhost:4200](http://localhost:4200)
- To connect the frontend to the backend, make sure to set the correct
  apiUrl (server url) in ```client/src/environments/environment.ts```



## Deploying Diamond

In order to deploy Diamond to a remote server, it is necessary that
the server supports Node.js v16 and MongoDB v4.

We recommend to use [Cyclic.sh](https://www.cyclic.sh/) for hosting 
the frontend and backend of Diamond. As a database provider, we 
recommend [MongoDB Atlas](https://www.mongodb.com/atlas/database). Both
offer a free-tier plan and are more than sufficient to run studies with
Diamond.

Deploying Diamond to Cyclic.sh works as follows:

- Create a fork of the official Diamond Github repository
- Connect your Diamond Github repository to Cyclic. How to do this is
  explained [here](https://docs.cyclic.sh/how-to/add-private-repository)
- Specify the following build options:
  + Root path: ```/server```
- Select Node v16 as runtime
- Create the following variables and apply your specific settings:
  + ADMIN_EMAIL: Email or username of Diamond's admin user
  + ADMIN_PWD: Password of Diamond's admin user
  + DB_CONNECTION_URL: Connection string to your MongoDB Atlas server

Deployment should start automatically. Cyclic will create a random
subdomain, where your version of Diamond will be available to users.


[![Deploy to Cyclic](https://deploy.cyclic.sh/button.svg)](https://deploy.cyclic.sh/)




## Contributors

Diamond is an extension of an earlier system called TreeTest, which
implemented web-based tree testing. Diamond added support for
web-based card sorting.


The following people have contributed to Diamond:

- Keith Andrews
  [kandrews@iicm.edu](mailto:kandrews@iicm.edu?subject=Rslidy)  
  Project Leader

- Mathias Blum  
  (Seminar Project SS 2023). Rethinking Diamond: A Web Application for 
  Tree Testing and Card Sorting.

- Mohamed Amine El Kaouakibi  
  (Bachelor's thesis 2023). Import and Export of Studies. 

- David Egger, Ludwig Reinhardt, Stefan Schnutt, Sebastian Überreiter  
  (IAweb WS 2022 G3). Improving the Diamond Tree Testing Tool.

- Philipp Brandl, Tamara David, and Bernhard Kargl  
  (IAweb WS 2021 G1). Made Card Sorting accessible.

- Christopher Oser, Markus Ruplitsch, and Markus Stradner  
  (IAweb WS 2020 G3). Added support for Card Sorting.

- Ajdin Mehic. Original developer of TreeTest.  
  (Master's Thesis 2019). TreeTest: Online Tree Testing for Information
  Hierarchies.

