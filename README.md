
# Introduction

Diamond is a web-based tool for information architects, which supports
both tree testing and card sorting. It is implemented using Angular as
its frontend, Node.js as its server, and MongoDB as its database.


# Features

- Registration and login.
- Create/edit/delete a study.
- Import an information hierarchy (tree) or set of cards as CSV.
- Launch/unlaunch a study.
- Perform a study.
- Analyse/view study results.
- Export study results as CSV.



# Running Diamond locally

By default, Diamond is configured to run locally on localhost.

The following set up is necessary the first time:
- Go to root directory, and run ```npm install```.
- Install MongoDB on the local machine (required for database).
- In ```server/user-paths.js``` configure the server URL and local MongoDB connection string,
  for example:
  - ```server_url: 'http://localhost:48792',```
  - ```db_connection_url: 'mongodb://localhost:27017/node-mongo-registration-login-api',```

The following is necessary every time to run Diamond locally:
- Start MongoDB on the local machine and make it ready to accept connections.
- In the root directory, run ```node server.js``` to start the Diamond server.
- In the root directory, run ```npx ng serve``` to start the Diamond frontend.

Navigate to http://localhost:4200/ to see the app.



# Deploying Diamond

In order to deploy Diamond to a remote server, it is necessary that
the server has Angular CLI, Node, and MongoDB pre-installed.

Additionally, the remote server URL and remote MongoDB connection
string must be configured in the file ```server/user-paths.js```.

For example:
- ```server_url: 'https://iaweb-diamond.herokuapp.com',```
- ```db_connection_url: 'mongodb+srv://root:root@cluster0-wqaum.mongodb.net/test?retryWrites=true&w=majority',```


Deploying Diamond can be automated using the [Heroku CLI
tool](https://devcenter.heroku.com/articles/heroku-cli).



# Admin Account

Diamond installation comes with a predefined admin account (username:
admin, password: admin189m). The admin password should be changed as
soon as possible through Diamond's Admin page.




# Contributors

Diamond is an extension of an earlier system called TreeTest, which
implemented web-based tree testing. Diamond added support for
web-based card sorting.


The following people have contributed to Diamond:

- Keith Andrews
  [kandrews@iicm.edu](mailto:kandrews@iicm.edu?subject=Rslidy)  
  Project Leader

- Christopher Oser, Markus Ruplitsch, and Markus Stradner  
  IAweb WS 2020 G3. Added support for Card Sorting.

- Ajdin Mehic  
  Master's Thesis. Original developer of TreeTest.

