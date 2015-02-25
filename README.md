# Dashboard

This is a simple Dashboard app (client & server) that demonstrates an Ember front end using D3.js to display data and a Node.js server on the backend connecting to Google Analytics API's. 

## To Install

After cloning the repository ...

### Dashboard-server

cd into the Dashboard-server directory. Update config.json with your google account and password and the view id from the google analytics account that you wish to use. The GA view id can be found under Admin->View Settings->View Id.

After the edit, update node_modules by running

> npm install

To run the server 

> npm dashboard.js

#### Dashboard-client

cd into the Dashboard-client directory.

Update node_module by running

> npm install

Update bower dependencies by running

> bower install

To run the client server

> ember server

Then with both the server and the client running, you should be able to navigate to:

> http://localhost:4200 

to view the Dashboard.
