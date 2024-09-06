
# Diamond - Developer Guide

This guide describes how to build Diamond from source code and run it
locally.


## Requirements

- [Node.js v16 (Gallium)](https://nodejs.org/en/download/releases)
- [MongoDB v4](https://www.mongodb.com/docs/v4.4/installation/)

To manage your Node.js installation, it is recommended to use
[NVM](https://github.com/nvm-sh/nvm) on macOS, Linux, or WSL, and to
use [NVM-Windows](https://github.com/coreybutler/nvm-windows) on
Microsoft Windows. The required Node.js version is printed to the
```.nvmrc``` file.



## Architecture

The project is set up as a multi-package repository containing both
frontend and backend code. To seperate both code bases, npm workspaces
are used. Currently, there are two workspaces: client (for frontend
code) and server (for backend code).


## Installing a MongoDB Database

There are three ways to provide a MongoDB database for use by Diamond:
1. Install MongoDB locally on the same machine
  (see [Install MongoDB](https://mongodb.com/docs/manual/installation/)).

2. Use a dockerised version of MongoDB.
To start the MongoDB docker container, go to ```/deploy/local``` and run
```docker-compose up -d```. This will start a MongoDB instance in the
background, which can be accessed by
```mongodb://127.0.0.1:27017/diamond```.
Use ```docker-compose down``` to shut down MongoDB.

3. Create an account with a MongoDB database provider,
   such as MongoDB Atlas ([mongodb.com](https://mongodb.com/)).




## Building and Running Diamond Locally

- Make sure to have the specified versions of Node.js.
- Create a local copy of the sample environment file 
  ```cp .env.sample .env``` and fill in the admin user name and password,
  and your MongoDB connection string. 
- Start your MongoDB database.
- Go to the project root folder.
- Run ```npm install``` to install all dependencies.
- Run ```npm run build``` to build the frontend.
- Run ```npm start``` to start the application.

Open your browser and go to 
[http://localhost:8000](http://localhost:8000).



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

