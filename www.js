#!/usr/bin/env node
const fs = require('fs');
const http = require('http');
const serveStatic = require('serve-static');
const finalhandler = require('finalhandler');

const {
  STATIC_DIR = 'dist',
  HOST_PORT = process.env.PORT || 80,
  API_URL = 'http://localhost:3005'
} = process.env;

const metaTags = Object.keys(process.env).reduce((env, name) =>
  name.startsWith('META_TAG_') ? Object.assign(env, {
    [name.replace(/^META_TAG_/, '')]: process.env[name]
  }) : env
, { API_URL });

const metaString = Object.keys(metaTags).map(name =>
  `<meta name="${name}" content="${metaTags[name]}">`
).join('\n  ');

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
