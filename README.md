npm-artifactory
===============

A proxy server that uses [Artifactory](http://www.jfrog.com/home/v_artifactory_opensource_overview) as a data store for npm modules.  Useful to seamlessly integrate node into your java/maven-based workflows.

Installation
============

    npm install npm-artifactory

Usage
======
Run the server:

    node app.js
    
Set your registry to point to the server (ie):

    npm config set registry http://localhost:3000/

Use npm as you would:

    npm publish
    npm install your-private-module

Notes
======
Configure `config.json` before running (make sure the credentials to Artifactory are correct).  The host and port are necessary for npm-artifactory to rewrite some urls to point to its instance instead of registry.npmjs.org.  Make sure this these values are externally accessible (ie, provide your ip address instead of 'localhost').

You may optionally specify a proxy address in the config (ex. 'http://localhost:9999')

License
=======
Apache License 2.0
