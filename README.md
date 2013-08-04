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
Configure `config.json` before running (make sure the credentials to Artifactory are correct).  The host and port is necessary to support tarball rewrites coming from the npmjs proxy (rewritten to the values specified here)

License
=======
Apache License 2.0
