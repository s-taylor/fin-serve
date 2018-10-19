#!/usr/bin/env node
const fs = require('fs');
// const http = require('http');
const http2 = require('http2');
const path = require('path');
const mime = require('mime-types');
// const serveStatic = require('serve-static');
// const finalhandler = require('finalhandler');

const {
  STATIC_DIR = 'dist',
  // HOST_PORT = process.env.PORT || 80,
  HOST_PORT = process.env.PORT || 443,
  // API_URL = 'http://localhost:3005'
  // API_URL = 'http://localhost:3005'
  API_URL = 'https://api.shortlyster.com'
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

// const serve = serveStatic(STATIC_DIR);
// console.log('Serving your files now!');

// const ONE_MONTH = 2628000;
// const MD5_HASHED_RESOURCE = /-[a-f0-9]{20,32}\.(js|css|jpg|svg|ico|eot|ttf|woff|woff2)(\?|$)/i;
// const setCaching = (req, res) => {
//   if (MD5_HASHED_RESOURCE.test(req.url)) {
//     res.setHeader('Cache-Control', `public, max-age=${ONE_MONTH}`);
//   }
// };

// const ASSET_PATH_RE = /\.(html|css$|js$|json|webapp|cache|jpg|svg|png|ico|txt|eot|ttf|woff|woff2)/;
// const server = http.createServer((req, res) => {
//   if (req.url === '/_health/ready' || req.url === '/_health/alive') {
//     res.end('OK');
//   }
//   if (!ASSET_PATH_RE.test(req.url)) {
//     req.url = '/';
//     res.end(metaAmmendedIndex);
//   } else {
//     setCaching(req, res);
//     serve(req, res, finalhandler(req, res));
//   }
// });

// server.listen(HOST_PORT);

const {
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_METHOD,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR
} = http2.constants;

const options = {
  // key: fs.readFileSync('./selfsigned.key'),
  // cert: fs.readFileSync('./selfsigned.crt')
  key: fs.readFileSync('./certs/server.key'),
  cert: fs.readFileSync('./certs/server.crt'),
  allowHTTP1: true
};

const server = http2.createSecureServer(options);
// const server = http2.createServer();

// const serverRoot = "./public";
const serverRoot = STATIC_DIR;

function respondToStreamError(err, stream) {
  console.log(err);
  if (err.code === 'ENOENT') {
    stream.respond({ ':status': HTTP_STATUS_NOT_FOUND });
  } else {
    stream.respond({ ':status': HTTP_STATUS_INTERNAL_SERVER_ERROR });
  }
  stream.end();
}

server.on('stream', (stream, headers) => {
  // console.log('stream', stream);
  // console.log('headers', headers);
  const reqPath = headers[HTTP2_HEADER_PATH];
  // const filePath = reqPath === '/' ? '/index.html' : reqPath;

  const reqMethod = headers[HTTP2_HEADER_METHOD];
  console.log('reqPath', reqPath);
  console.log('reqMethod', reqMethod);

  if (reqPath === '/' || reqPath === '/index.html') {
    console.log('sending amendend index');
    stream.respond({ ':status': 200 });
    return stream.end(metaAmmendedIndex);
  }

  const fullPath = path.join(serverRoot, reqPath);
  const responseMimeType = mime.lookup(fullPath);

  stream.respondWithFile(fullPath, {
    'content-type': responseMimeType
  }, {
    onError: (err) => respondToStreamError(err, stream)
  });
});

// server.listen(443);
console.log(`listening on port: ${HOST_PORT}`);
server.listen(HOST_PORT);
