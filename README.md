
# Diamond - A Card-Sorting and Tree-Testing Application



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

- [MongoDB Atlas](https://www.mongodb.com/atlas/database)
- NodeJS Webhosting [Cyclic.sh](https://www.cyclic.sh/)



## Deploying Diamond

In order to deploy Diamond to a remote server, it is necessary that
the server supports Node.js v16 and MongoDB v4 or higher.

We recommend to use [Cyclic.sh](https://www.cyclic.sh/) for hosting 
the frontend and backend of Diamond. As a database provider, we 
recommend [MongoDB Atlas](https://www.mongodb.com/atlas/database). Both
offer a free-tier plan and are more than sufficient to run studies with
Diamond.

Follow the following steps in the exact order to setup and deploy Diamond:



### 1. Setup a MongoDB Atlas Cluster
More detailed and instructions on how to setup a free-tier MongoDB cluster can be found [here](https://www.mongodb.com/docs/atlas/getting-started/).

- Sign up to MongoDB Atlas or use your Github account.
- After signup, you will be redirected to Atlas' dashboard.
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
- Copy and save the connection string.



### 2. Setup Cyclic.sh

- Create a fork of the official Diamond Github repository
- Sign up to Cyclic.sh or use our Github account.
- After signup, you will be redirected to Cyclic's dashboard.
- Next, you need to connect your forked Diamond Github repository to your Cyclic acount. A detailed explanation can also be found [here](https://docs.cyclic.sh/how-to/add-private-repository).
- Choose tab ```Link yout own```
- Use the searchbar to search for your forked Diamond Github repository
- On the next screen, click ```Advanced``` to specify the following build options:
  + Root Path: ```/server```
  + Output Path: ```/```
  + Static Site: ```No``` 
  + Runtime: ```Node 16.16.0``` (any Node 16 version is fine)
  + Branch: ```main```
- Click ```Connect```.
- Next select your forked Diamond Github repository to approve and install Cyclic's Github app. Default permissions are fine.
- Click ```Approve & Install```.
- Now, Cyclic will build, deploy and run Diamond.
- Next, go to the dashboard and choose the tab ```Variables```.
- Specify the following environment variables:
  + ADMIN_EMAIL: Email or username of Diamond's admin user
  + ADMIN_PWD: Password of Diamond's admin user
  + MAX_REQUEST_PAYLOAD_SIZE: 6mb
  + DB_CONNECTION_URL: Connection string to your MongoDB Atlas server. ( As copied and saved during your MongoDB Atlas setup.)
- Click ```Save``` to save your environment variables.
- Next, chose the tab ```Deployments```.
- Click ```Redeploy``` to restart Diamond, to use the new environment variables.
- Setup is now finished.
- Use the button ```Open App``` to access Diamond.
- The URL can be found in the tab ```Overview```.
- Optionally, a custom subdomain can be set via the tab ```Advanced``` using the custom domain settings.


[![Deploy to Cyclic](https://deploy.cyclic.sh/button.svg)](https://deploy.cyclic.sh/)


## Troubleshooting

- Browser shows Error: The application failed to start. 
- Error logs can be found in Cyclic's dashboard via tab ```Logs```
- Database connection error:
  + Check if the connection string is correct and your MongoDB is active and running
  + MongoDB Atlas often pauses the database cluster due to inactivity.
  + Login to MongoDB Atlas and manually activate your database cluster.
  + Redeploy Diamond on Cyclic via the dashboard using the tab ```Deployments``` and clicking ```Redeploy``` on the latest deployment.


## Developer Guide
A developer Guide can be found in the README-dev.md file.

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


