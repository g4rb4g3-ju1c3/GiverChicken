"use strict";

import { WriteStream } from "fs";
import { App } from "./app";

const c = require("./constants")();
const fs = require("fs");
const moment = require("moment");

let logfile: WriteStream | null = null;
let tp_seq: number = 1;

module.exports = (app: App) => {

  const init = (): void => {
    if (app.log.to_file) {
      logfile = fs.createWriteStream(app.log.filename, {
        mode: 0o600,
        flags: "a",
      });
      logfile?.on("error", (err: any) => {
        console.log(`logfile error: ${err}`);
      });
    }
  };

  const close = (): void => {
    if (logfile) {
      fs.closeSync(logfile);
      logfile = null;
    }
  };

  const tp_init = (): void => {
    tp_seq = 1;
  };

  const tp = (text?: string): void => {
    const message = `tp ${tp_seq++}${text ? `: ${text}` : ""}`;
    if (app.log.to_console) {
      console.log(message);
    }
    if (app.log.to_file) {
      logfile?.write(`${message}\n`);
    }
  };

  const string = (text: string): void => {
    if (app.log.to_console) {
      console.log(text);
    }
    if (app.log.to_file) {
      logfile?.write(`${text}\n`);
    }
  };

  const ts_string = (text: string): void => {
    text = `${moment().format(c.app.TIMESTAMP_FORMAT)}   ${text}`;
    if (app.log.to_console) {
      console.log(text);
    }
    if (app.log.to_file) {
      logfile?.write(`${text}\n`);
    }
  };

  const msg = (origin: string, message: string): void => {
    if (!origin) {
      origin = "";
    }
    if (!message) {
      message = "";
    }
    message = `${moment().format(c.app.TIMESTAMP_FORMAT)}   ` +
      (origin + "                                        ").substring(0, 40) +
      message.replace(/\n/g, "\n                                                                  ");
    if (app.log.to_console) {
      console.log(message);
    }
    if (app.log.to_file) {
      logfile?.write(`${message}\n`);
    }
  };

  const dir = (object: any): void => {
    if (app.log.to_console) {
      console.dir(object);
    }
    if (app.log.to_file) {
      logfile?.write(`${JSON.stringify(object, null, 3)}\n`);
    }
  };

  const req = (origin: string, req: any) => {
    msg(origin,
      "hostname:    " + req.hostname                + "\n" +
      "ip:          " + req.ip                      + "\n" +
      // "ips:         " + req.ips                     + "\n" +
      "secure:      " + req.secure                  + "\n" +
      "protocol:    " + req.protocol                + "\n" +
      "method:      " + req.method                  + "\n" +
      "xhr:         " + req.xhr                     + "\n" +
      "baseUrl:     " + req.baseUrl                 + "\n" +
      // "originalUrl: " + req.originalUrl             + "\n" +
      "path:        " + req.path                    + "\n" +
      "route:       " + JSON.stringify(req.route)   + "\n" +
      "params:      " + JSON.stringify(req.params)  + "\n" +
      "query:       " + JSON.stringify(req.query)   + "\n" +
      "body:        " + JSON.stringify(req.body)    + "\n" +
      "cookies:     " + JSON.stringify(req.cookies) + "\n" +
      "fresh:       " + req.fresh                   + "\n" +
      "stale:       " + req.stale
   );
  };

  const sys = (text: string): void => {
    if (app.cfg.env_prd) {
      console.log(text);
    }
  };

  return {
    init, close,
    tp_init, tp,
    string, ts_string,
    msg, dir, req, sys,
  };

};
