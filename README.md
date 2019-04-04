# LB Mesh CLI

LB Mesh is a Cloud Native Microservice Framework built around loopback.io.  This version is for LB3 exclusively.  

This will scaffold an opinionated stack of Loopback Projects that are architected to run off PM2 or as Docker Containers ( setting the stage to be deployed to Kubernetes). This framework allows you to think cloud native first to build very complex applications or use single components to build simple microservice monoliths.  

Don't have a use for the full stack? You can easily leverage any component individually. 


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

<img src="https://s3.amazonaws.com/lbmesh/lbmesh-cli2.png" height="350" />
 

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

To reimport projects back in the list or if someone shares a project with you and you check it out through source control, you can use this command to import into list of projects.

```
  $ lbmesh projects import
```

#### Working with Databases


There is a built in management of container databases available within LB Mesh. On install, you can get a list of the available database instances with initial port settings by running this command. 

```
  $ lbmesh db
```

<img src="https://s3.amazonaws.com/lbmesh/lbmesh-db-status.png" height="350"/>

<div style="height:12px;"></div>

To change any of these default ports, please use this command. 

```
  $ lbmesh db config
```

It will give you a list of databases to set a new port. 
 

**Starting Databases** 

There are two ways to start up you databases.  If you wish to start this whole stack, run the following command. 

```
	$ lbmesh db start
```

Or you can start and individual service using the following command:

``` 
	$ lbmesh db start [mongodb|mysql|cloudant|redis|postgres]
```

**Check Database Status**

The DB component of LB Mesh also includes a command to check the status of what containers are running.  It's the same as running **docker ps** but we have included a filter to just view lbmesh specific containers. 

```
	$ lbmesh db status
```
This is a great way to confirm that containers are starting on the default ports or ones you updated the global config to use. 

**Stopping Databases**

All the db start commands will start the databases once your machine restarts since they include the **restart: always** config.  To stop your database stack, do the following. 

Individual Databases
```
	$ lbmesh db stop [mongodb|mysql|cloudant|redis|postgres]
```

All Databases
``` 
	$ lbmesh db stop
```

All Database containers automatically persist data to the filesystem so upon restart everything will be intact.


#### Working Inside Projects


These cli commands are available inside a LBMesh Project folder.  Let's walk through each of them
```
  $ lbmesh run [start|stop|reset|status|delete|logs]
  $ lbmesh open
  $ lbmesh build

```

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

**Opening Project**

If you run the command **lbmesh projects [projname]** it will give you a list of the ports assigned to your project components.  To open each component in browser tabs, run the following command. 

```
	$ lbmesh open
```



## How can I report an issue or make a request?

The easiest way is to start a git issue, and I will attempt to answer ASAP. [GitHub Issues](https://github.com/lb-mesh/lbmesh-cli/issues)

## Authors

Jamil Spain 
* Twitter: [@iamjamilspain](https://www.twitter.com/iamjamilspain)
* LinkedIn: [Jamil Spain Profile](https://www.linkedin.com/in/jamilspain/)


## Source

[GitHub Source Code](https://github.com/lb-mesh/lbmesh-cli)
