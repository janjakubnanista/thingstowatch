// # Ghost bootloader
// Orchestrates the loading of Ghost
// When run from command line.

var express,
    ghost,
    parentApp,
    errors;

var path = require('path');
var hbs = require('express-hbs');

// Make sure dependencies are installed and file system permissions are correct.
require('./core/server/utils/startup-check').check();

// Proceed with startup
express = require('express');
ghost = require('./core');
errors = require('./core/server/errors');

// Create our parent express app instance.
parentApp = express();

ghost().then(function (ghostServer) {
    // Mount our ghost instance on our desired subdirectory path if it exists.
    parentApp.use(ghostServer.config.paths.subdir, ghostServer.rootApp);

    // Load helpers if available
    try {
        var helpersPath = path.join(ghostServer.config.paths.contentPath, 'helpers');
        var helpers = require(helpersPath);

        helpers(hbs);
    } catch (error) {
        console.error(('Error loading helpers: ' + error.message).red);
    }

    // Let ghost handle starting our server instance.
    ghostServer.start(parentApp);
}).catch(function (err) {
    errors.logErrorAndExit(err, err.context, err.help);
});
