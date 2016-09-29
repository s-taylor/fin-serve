#!/usr/bin/env node

const http = require('http');
const serveStatic = require('serve-static');
const finalhandler = require('finalhandler');

const STATIC_DIR = process.env.STATIC_DIR || `${__dirname}/dist`;
const HOST_PORT = process.env.HOST_PORT || 8000;

const serve = serveStatic(STATIC_DIR);

const server = http.createServer((req, res) => {
  req.url = '/';
  serve(req, res, finalhandler(req, res));
});

server.listen(HOST_PORT);
