# Skeleton API and UI Project
![Version](https://s3.eu-west-2.amazonaws.com/endeavour-codebuild/badges/skeleton/version.svg)
![Build Status](https://s3.eu-west-2.amazonaws.com/endeavour-codebuild/badges/skeleton/build.svg)
![Unit Tests](https://s3.eu-west-2.amazonaws.com/endeavour-codebuild/badges/skeleton/unit-test.svg)

A skeleton project containing a fully working Java API and Angular UI allowing anyone to start developing quickly

This is a fully working end to end sample including:

* Keycloak integration for both the API and the Angular frontend.  
* Dropwizard Metrics for all API calls  
* Swagger integration for documentation of API calls  
* Connects to the Config database to retrieve DB connection strings and Keycloak config

**NOTE: If you are using a copy of this as a template for a new application, open the "TODO" window (IntelliJ) to see the list of application specific entries.**

## API Information  
The project is setup as follows.

#### database  
Contains all the Java DB entities for the tables in the models folder and PersistenceManager which handles the connections to the DB.
 
#### endpoints  
Contains all the endpoints for the API 

#### logic
Contains the business logic for the application.  This is where most of the code is held and should be unit tested

#### framework
Contains standard exception classes and swagger bootstrap code.  This is also where the Metrics are initialised on loading

#### json
JSON representations of the DB entities to allow communication between frontend and backend

#### Metrics 
Contains the standard implementations for the metrics code

#### Running API
create a run configuration in intelliJ using Tomcat -> Local.  
In deployment tab, click + choose Artifact and select API:war exploded
In the startup tab, click on debug and add these options into the environment variables. 

CONFIG_JDBC_CLASS=com.mysql.jdbc.Driver
CONFIG_JDBC_URL=jdbc:mysql://localhost:3306/config?useSSL=false
CONFIG_JDBC_USERNAME=root
CONFIG_JDBC_PASSWORD=<password>

Click run and it should be up and running.

## Frontend Information
This is using Angular CLI so use this for creating any new components.  https://cli.angular.io/ for more information.

service.ts files are used to communicate with the API.

#### Running Frontend.  
Create a run configuration in intelliJ using npm
in the script input type start
Click run and it should start running on [http://localhost:4200](http://localhost:4200/) 


**Please keep this project updated with any additions/modifications when starting or contributing to a new project to allow others to get up to speed as quickly as possible.**

