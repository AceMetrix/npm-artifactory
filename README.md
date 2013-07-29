npm-artifactory
===============

A proxy server that uses [Artifactory](http://www.jfrog.com/home/v_artifactory_opensource_overview) as a data store for npm modules.  Useful to seamlessly integrate node into your java/maven-based workflows.

In a Maven-esque style, npm-artifactory will proxy requests from npmjs.org if the module isn't found in artifactory.

Installation
============

    npm install npm-artifactory

Usage
======
Set your registry to point to the server (ie):

    npm config set registry http://localhost:3000/

Use npm as you would:

    npm publish
    npm install your-private-module

Notes
======
Create a `config.json` file before running (make sure the credentials to Artifactory are correct).  An example is provided in `config.example.json`.

License
=======
Apache 2.0
