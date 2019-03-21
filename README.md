# LB Mesh CLI

Simple CLI Utility to Encrypt and Decrypt Plain Text Password with AES Encryption.  

This allows you to setup an encrypted string on one end that can potentially be decryption on the other end once each have the same key.

Great Utility for your producing environment variables for your microservices. 

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
