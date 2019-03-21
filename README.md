# LB Mesh CLI

LB Mesh is a Cloud Native Microservice Framework built around loopback.io.  This version is for LB3 exclusively.  

This will scaffold an opinionated stack of Loopback Projects that are architected to run off PM2 or as Docker Containers.  

Don't have a use for the full stack? You can easily leverage any component individually. 


## Installation

 ```
 npm install -g lbmesh-cli
``` 

This will expose a simple command on your CLI.

```
lbmesh
```

OR

```
lbm
```

##Usage

Running the command above will give you all the options available

![](https://s3.amazonaws.com/lbmesh/lbmesh-cli.png)

## Features

Coming soon

## Examples

These cli commands are available anywhere on the filesystem. 

```
  $ lbmesh create
  $ lbmesh projects
  $ lbmesh projects [projectname] 

```

These cli commands are available inside a LBMesh Project folder.
```
  $ lbmesh run [start|stop|reset|status|delete]
  $ lbmesh open
  $ lbmesh build

```

## How can I report an issue or make a request?

The easiest way is to start a git issue, and I will attempt to answer ASAP. [GitHub Issues](https://github.com/lb-mesh/lbmesh-cli/issues)

## Source

[GitHub Source Code](https://github.com/lb-mesh/lbmesh-cli)
