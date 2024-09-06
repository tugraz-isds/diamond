
# Diamond - A Web Application for Card Sorting and Tree Testing



## Introduction

Diamond is a web-based tool for information architects, which supports
both tree testing and card sorting. It is implemented using Angular as
its frontend, Node.js as its server, and MongoDB as its database.



## Features

- Registration and login.
- Create, edit, and delete a study.
- Import an information hierarchy (for tree testing) or set of cards
  (for card sorting) as CSV.
- Launch and stop a study.
- Perform a study.
- View and analyse study results.
- Export study results as CSV.



## Requirements

- GitHub account, at [github.com](https://github.com/).

- MongoDB database host (v4 or higher), say at MongoDB Atlas
  [https://mongodb.com/atlas/](https://mongodb.com/atlas/).

- NodeJS web host (v16), say at Render [render.com](https://render.com/).



## Deploying Diamond

In order to run a tree test or card sorting study, it is necessary to
set up and self-host a Diamond server. The steps required are
described here.

First, as noted above, it is necessary to have a provider (host) for
both a MongoDB database and a NodeJS web application.  We recommend
using [Render](https://render.com/) for hosting the Diamond web
application. As a database provider, we recommend [MongoDB
Atlas](https://mongodb.com/atlas/database). Both offer a free-tier
plan and are more than sufficient to run studies with Diamond.


Follow the steps below to setup and deploy Diamond:

### 1. Set Up a MongoDB Atlas Cluster

- Sign up to MongoDB Atlas at [https://mongodb.com/atlas/](https://mongodb.com/atlas/).
- After signup, you will be redirected to the Atlas dashboard.
- Click ```Build Database``` to create a new MongoDB database.
- Choose the ```Shared``` deployment option.
- Select the cloud provider and region of your choice. Defaults are fine.
- Under ```Addtional Settings``` the MongoDB version can be selected. Again, defaults are fine.
- Optionally, the cluster name can be changed.
- Click ```Create Cluster```. This may take a while.
- Next, specify a username and password. These credentials are used to connect to this database cluster. All users can be viewed and managed via ```Security > Database Access```.
- Next, go to ```Security > Network Access```
- Click ```Allow access from anywhere``` or specify ```0.0.0.0/0``` as access list entry.
- Click confirm to save the network access settings. This may take a while.
- Next, go to ```Deployment > Database```
- Here, you will find all created MongoDB clusters.
- Click the ```Connect``` button next to the newly created cluster.
- A modal window will pop up. Choose ```Connect to your application > Drivers```.
- Copy and save the database connection string.

More detailed instructions on setting up a free-tier MongoDB cluster
can be found at
[https://mongodb.com/docs/atlas/getting-started/](https://mongodb.com/docs/atlas/getting-started/).



### 2. Set Up Deployment at Render

- Create a fork of the official Diamond GitHub repository
  [https://github.com/tugraz-isds/diamond](https://github.com/tugraz-isds/diamond).

- Sign up to [Render](https://render.com/) using your GitHub account.

- After signup, you will be redirected to Render's dashboard.

- Next, connect your forked Diamond Github repository to your Render
  acount:

  + Choose tab ```Link your own```

  + Use the search bar to search for your forked Diamond Github repository.

  More information can be found at
  [https://docs.cyclic.sh/how-to/add-private-repository]
  (https://docs.cyclic.sh/how-to/add-private-repository).

- On the next screen, click ```Advanced``` to specify the following build options:
  + Root Path: ```/server```
  + Output Path: ```/```
  + Static Site: ```No``` 
  + Runtime: ```Node 16.16.0``` (any Node 16 version is fine)
  + Branch: ```main```

- Click ```Connect```.

- Next, select your forked Diamond Github repository to approve and
  install Cyclic's Github app. The default permissions are fine.

- Click ```Approve & Install```.

- Now, Cyclic will build, deploy, and run Diamond.
  Before Diamond can be used, however, it is first necessary to configure
  the environment variables.

- Go to the dashboard and choose the tab ```Variables``` and specify
  the following environment variables:
  + ADMIN_USERNAME: User name of Diamond's admin user.
  + ADMIN_PWD: Password of Diamond's admin user.
  + MAX_REQUEST_PAYLOAD_SIZE: 6mb (limit of Cyclic).
  + NPM_CONFIG_CACHE: /tmp/.npm
  + DB_CONNECTION_URL: The database connection string to your MongoDB Atlas server
    (as copied and saved during MongoDB Atlas setup).

  The admin user is only created if it does not already exist.

- Click ```Save``` to save your environment variables.

- Next, chose the tab ```Deployments```.

- Choose the most recent deployment in the list, click ```Details```
  and then select ```Redeploy``` to redeploy Diamond with the latest
  environment variables.

- Setup is now finished.

- Optionally, a custom subdomain can be set via the tab ```Environments```.

- Use the button ```Open App``` to access Diamond.

- The URLs associated with the deployment can be found in the tab
  ```Overview```.



## Troubleshooting

- Browser shows “Error: The application failed to start.” 

  + Consult the Cyclic error logs in the tab ```Logs```.

  + If there is a database connection error:
    * Check that the database connection string is correct and your MongoDB is active and running.
    * MongoDB Atlas sometimes pauses the database cluster due to inactivity.
    * Log in to MongoDB Atlas and manually activate your database cluster.
    * Redeploy Diamond on Cyclic via the dashboard using the tab ```Deployments```
      and clicking ```Details``` and ```Redeploy``` on the latest deployment.



## Developer Guide

For developers who want to build Diamond from source code, a
Developer Guide can be found in the
[README-dev.md](https://github.com/tugraz-isds/diamond/blob/main/README-dev.md)
file.



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


