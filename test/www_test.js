const http = require('http');
const fs = require('fs');

const asset = fs.readFileSync('test/fixtures/index.html').toString();
const jsAsset = fs.readFileSync('test/fixtures/app.js').toString();

describe('/', () => {
  it('should return 200', (done) => {
    http.get('http://localhost:8000/', (res) => {
      res.statusCode.must.equal(200);
      done();
    });
  });

  it('should return html assets', (done) => {
    http.get('http://localhost:8000', (res) => {
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
    http.get('http://localhost:8000/app.js', (res) => {
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
    http.get('http://localhost:8000/flingledorp', (res) => {
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
    http.get('http://localhost:8000/app.js.map', (res) => {
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
