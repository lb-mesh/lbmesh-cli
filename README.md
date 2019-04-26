# LB Mesh Framework CLI

LB Mesh is a Cloud Native Microservice Framework built around loopback.io.  This version is for LB3 exclusively.  

This will scaffold an opinionated stack of Loopback Projects that are architected to run off PM2 or as Docker Containers ( setting the stage to be deployed to Kubernetes). This framework allows you to think cloud native first to build very complex applications or use single components to build simple microservice monoliths.  

Don't have a use for the full stack? You can easily leverage any component individually. 

In addition to leveraging LB for development, there are two other components that will assist with generating middleware for the Framework to use in a project.  We provide easy commands to use common databases and integration tools. All leveraging the power of Docker containers.  


## Installation

```
	$ npm install -g lbmesh-cli
``` 

This will expose a simple command on your CLI.

```
	$ lbmesh
```

OR

```
	$ lbm
```

##Usage

Running the command above will give you all the options available

<img src="https://s3.amazonaws.com/lbmesh/lbmesh-cli-v2.png" height="350" />
 

These cli commands are available anywhere on the filesystem. 

```
  $ lbmesh create
  $ lbmesh projects
  $ lbmesh projects [projectname] 

```
If you want to reset the list of projects, maybe after deleting a few, you can reset the whole list by doing this command. 

```
  $ lbmesh projects reset
```
It will as you to confirm and list will be cleared ( when you run lbmesh projects ).

<div style="height:18px;"></div>

 
#### Working with Databases

There is a built in management of database containers available within LB Mesh. On install, you can get a list of the available database instances with initial port settings by running this command. 

```
  $ lbmesh db
```

<img src="https://s3.amazonaws.com/lbmesh/lbmesh-db-status-v2.png" height="350"/>

<div style="height:12px;"></div>

Let's go over the lifecycle for managing these containers.  Here is a chart to show the overall view. 

<img src="https://s3.amazonaws.com/lbmesh/lbmesh-containers-2.png" />

<div style="height:12px;"></div>

**[lbmesh db pull] Downloading the images**

To get started with any database from the list, the image must be available locally on your system. We provide an easy way to download the required image and use with the commands below. 

```
	$ lbmesh db pull [mongodb|mysql|cloudant|redis|postgres|mssql]
```

<div style="height:9px;"></div>

**[lbmesh db start] Starting Databases** 

Each database instance will need to be started up individually. 

``` 
	$ lbmesh db start [mongodb|mysql|cloudant|redis|postgres|mssql]
```

<div style="height:9px;"></div>

**[lbmesh db logs] Viewing Database Container Logs**

You can view  logs for any database container by doing the following command:

```
	$ lbmesh db logs [mongodb|mysql|cloudant|redis|postgres|mssql]
```

<div style="height:9px;"></div>

**[lbmesh db config] Updating Port Config**

To change any of these default ports, please use this command. 

```
  $ lbmesh db config
```

It will give you a list of databases to set a new port. 

<div style="height:9px;"></div>

**[lbmesh db status] Check Database Status**

The DB component of LB Mesh also includes a command to check the status of what containers are running.  It's the same as running **docker ps** but we have included a filter to just view lbmesh specific containers. 

```
	$ lbmesh db status
```

This is a great way to confirm that containers are starting on the default ports or ones you updated the global config to use. 

<div style="height:9px;"></div>

**[lbmesh db stop] Stopping Databases**

All the db start commands will start the DB container.  You will need to start the containers if you reboot your machine. To stop your specific database container, you can do the following: 

```
	$ lbmesh db stop [mongodb|mysql|cloudant|redis|postgres|mssql]
```

All Database containers automatically persist data to the filesystem so upon restart everything will be intact.

<div style="height:9px;"></div>

**[lbmesh db remove] Removing Databases**

When you do a pull, it will download the source image and build a container for you to use off that image.  At some point you want to remove this database, you can run the following command:

```
	$ lbmesh db remove [mongodb|mysql|cloudant|redis|postgres|mssql]
```

It will ask you to confirm that you want to remove the container and source image.  Your data directory will still be persisted, so once you do a pull again it will pick back up where it left off.  

<div style="height:18px;"></div>

#### Working with Integrations


There is a built in management of integration containers available within LB Mesh. On install, you can get a list of the available integration instances with initial port settings by running this command. 

```
  $ lbmesh integ
```

<img src="https://s3.amazonaws.com/lbmesh/lbmesh-integrate-2.png" height="350"/>

<div style="height:9px;"></div>

**Downloading the Images**

To get started with any integration from the list, the image must be available locally on your system. We provide an easy way to download the required image and use with the commands below. 

```
	$ lbmesh integ pull [datapower|mqlight|iib|mq|rabbitmq|acemq]
```

<div style="height:9px;"></div>

**Starting Integrations** 

Each integration instance will need to be started up individually. 

``` 
	$ lbmesh integ start [datapower|mqlight|iib|mq|rabbitmq|acemq]
```

<div style="height:9px;"></div>

**Viewing Integration Container Logs**

Just like the DB instances, you can view  logs from an integration container by doing the following command:

```
	$ lbmesh integ logs [datapower|mqlight|iib|mq|rabbitmq|acemq]
```

<div style="height:9px;"></div>


**Check Integration Status**

The INTEG component of LB Mesh also includes a command to check the status of what containers are running.  It's the same as running **docker ps** but we have included a filter to just view lbmesh integration specific containers. 

```
	$ lbmesh integ status
```
This is a great way to confirm that containers are starting on the default ports.  At the current moment, you are not allowed to modify the 
**Stopping Integrations**

All the integration start commands will start the integration instance.  Once your machine restarts you will need to restart the instances.  

Individual Integration Instances
```
	$ lbmesh integ stop [datapower|mqlight|iib|mq|rabbitmq|acemq]
```

All Integration containers automatically persist data to the filesystem so upon restart everything will be intact.

<div style="height:18px;"></div>


#### Working Inside Projects


These cli commands are available inside a LBMesh Project folder.  Let's walk through each of them
```
  $ lbmesh run [start|stop|reset|status|delete|logs]
  $ lbmesh open
  $ lbmesh build

```

<div style="height:18px;"></div>

**Running the Project**

When you are in the root of a LB Mesh Project, you can use the following commands to work with running the stack with PM2.  The CLI wraps around PM2 to provide some easy management for you. You can still however use PM2 commands yourself to manage the stack.  

Command  | sub command|  PM2 Comparable | Notes 
------------- | ------------ |  ------------- |  -------------
lbmesh run    | start | pm2 start pm2.ecosystem.config.yaml   | Starts the stack
lbmesh run    | stop | pm2 stop pm2.ecosystem.config.yaml  | stops all apps in the stack
lbmesh run    | reset | pm2 restart pm2.ecosystem.config.yaml |   restarts all the apps in the stack 
lbmesh run   | status | pm2 list | Check status of apps ( uptime, memory, restarts )
lbmesh run   | delete | pm2 delete pm2.ecosystem.config.yaml  | removes apps from pm2 
lbmesh run   | logs [appname] | pm2 logs [appname] | runs logs console for app by name. check the status command to get app name. 

<div style="height:9px;"></div>

**Importing Projects**

At some point, you may want to share a project with someone else through source control.  Or the second use case involves a reinstallation the framework cli to upgrade to a new version ( your workspace folder will be retained ).  In either case, this command will allow you import this project into your project list.  

```
	$ lbmesh projects import
```

If this is an import from github or some other source control, you will need to run 'npm install' in order to be able to run the **lbmesh run** commands.  This command will also prompt your to run 'npm install' in all the projects folder to allow you to be able to run **lbmesh run** immediately.  

<img src="https://s3.amazonaws.com/lbmesh/lbmesh-project-import.png" width="550" />

<div style="height:18px;"></div>

####Opening Project in Browser

If you run the command **lbmesh projects [projname]** it will give you a list of the ports assigned to your project components.  To open each component in browser tabs, run the following command. 

```
	$ lbmesh open
```

<div style="height:18px;"></div>

## Changelog

Click to view the [CHANGELOG.MD](https://github.com/lb-mesh/lbmesh-cli/blob/master/CHANGELOG.md)

<div style="height:18px;"></div>

## How can I report an issue or make a request?

The easiest way is to start a git issue, and I will attempt to answer ASAP. [GitHub Issues](https://github.com/lb-mesh/lbmesh-cli/issues)

<div style="height:18px;"></div>

## Authors

Jamil Spain 
* Twitter: [@iamjamilspain](https://www.twitter.com/iamjamilspain)
* LinkedIn: [Jamil Spain Profile](https://www.linkedin.com/in/jamilspain/)

<div style="height:12px;"></div>


## Source

[GitHub Source Code](https://github.com/lb-mesh/lbmesh-cli)
