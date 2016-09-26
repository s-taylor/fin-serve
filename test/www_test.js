const http = require('http');
const fs = require('fs');

const asset = fs.readFileSync('test/fixtures/index.html').toString();

describe('/', () => {
  it('should return 200', (done) => {
    http.get('http://localhost:8000', (res) => {
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
});

describe('/whatever', () => {
  it('should return 200 & static assets on all routes', (done) => {
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
});
