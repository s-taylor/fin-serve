#!/usr/bin/env node
const fs = require('fs');
const http = require('http');
const serveStatic = require('serve-static');
const finalhandler = require('finalhandler');

const STATIC_DIR = `${process.cwd()}/${process.env.STATIC_DIR || 'dist'}`;
const HOST_PORT = process.env.PORT || process.env.HOST_PORT || 9000;
const META_API_LOCATION = process.env.API_URL || 'http://localhost:3005';
const metaString = `<meta name="API_URL" content="${META_API_LOCATION}">`;

const normalIndex = fs.readFileSync(`${STATIC_DIR}/index.html`, 'utf8');
const metaAmmendedIndex = !normalIndex ? '' :
  normalIndex.split('\n').reduce((full, line) => {
    full += `${line}\n`;
    if (line.includes('<head>')) full += `  ${metaString}\n`;
    return full;
  }, '');

const serve = serveStatic(STATIC_DIR);
console.log('Serving your files now!');

const server = http.createServer((req, res) => {
  if (req.url === '/_health/ready' || req.url === '/_health/alive') {
    res.end('OK');
  }
  if (!req.url.match(/\.(html|css$|js$|json|webapp|cache|jpg|svg|png|ico|txt|eot|ttf|woff)/g)) {
    req.url = '/';
    res.end(metaAmmendedIndex);
  } else {
    serve(req, res, finalhandler(req, res));
  }
});

server.listen(HOST_PORT);
