const http = require('http');
const fs = require('fs');

const asset = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta name="API_URL" content="http://localhost:3005">
  <meta charset="UTF-8">
  <title>TEST</title>
</head>
<body>
  <p>TEST<p>
  <script src="app.js"></script>
</body>
</html>

`;
const jsAsset = fs.readFileSync('test/fixtures/app.js').toString();

describe('/', () => {
  it('should return 200', (done) => {
    http.get('http://localhost:9000/', (res) => {
      res.statusCode.must.equal(200);
      done();
    });
  });
  it.skip('should return 200 OK on _health/ready', (done) => {
    http.get('http://localhost:9000/_health/ready', (res) => {
      res.statusCode.must.equal(200);
      res.on('data', (chunk) => {
        chunk.must.equal('OK');
      });
      done();
    });
  });
  it.skip('should return 20 OK on _health/alive', (done) => {
    http.get('http://localhost:9000/_health/alive', (res) => {
      res.statusCode.must.equal(200);
      res.on('data', (chunk) => {
        chunk.must.equal('OK');
      });
      done();
    });
  });

  it('should return html assets', (done) => {
    http.get('http://localhost:9000', (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        data.must.equal(asset);
        done();
      });
    });
  });

  it('should return js assets', (done) => {
    http.get('http://localhost:9000/app.js', (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        data.must.equal(jsAsset);
        done();
      });
    });
  });
});

describe('/whatever', () => {
  it('should return 200, and index.html on incorrect path', (done) => {
    http.get('http://localhost:9000/flingledorp', (res) => {
      res.statusCode.must.equal(200);
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        data.must.equal(asset);
        done();
      });
    });
  });

  it('should return 200, and index.html on incorrect file types', (done) => {
    http.get('http://localhost:9000/app.js.map', (res) => {
      res.statusCode.must.equal(200);
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        data.must.equal(asset);
        done();
      });
    });
  });
});

describe('caching headers', () => {
  it('doesnt cache normal resources', (done) => {
    http.get('http://localhost:9000/app.js', (res) => {
      res.headers['cache-control'].must.eql('public, max-age=0');
      done();
    });
  });

  it('caches md5 hashed resources', (done) => {
    http.get('http://localhost:9000/app-3378250e9d0b30cc15fa.js', (res) => {
      res.headers['cache-control'].must.eql('public, max-age=2628000');
      done();
    });
  });
});
