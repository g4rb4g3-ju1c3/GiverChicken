#!/usr/bin/env node

"use strict";

export interface App {
  info: any;
  // Log configuration:
  log: any;
  // General configuration:
  cfg: any;
  // File system paths to various locations:
  path: any;
}

const app: App = {
  info: {},
  log:  {
    to_console: true,
    to_file: false,
  },
  cfg:  {},
  path: {},
};

// Restrict permissions to the current user only:
//  Remember umask bits are opposite of chmod.  1 disables the permission and 0 allows it.
process.umask(0o077);

const c   = require("./constants")();
const log = require("./log"      )(app);

log.msg("Let's get chicken!!!");
log.msg(`TIMESTAMP_FORMAT = ${c.app.TIMESTAMP_FORMAT}`);
