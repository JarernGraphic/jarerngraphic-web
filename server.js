const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

function getRequestBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    return res.end();
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Handle Serverless API routes locally
  if (pathname.startsWith('/api/')) {
    let apiFilePath = path.join(PUBLIC_DIR, pathname + '.js');
    if (!fs.existsSync(apiFilePath)) {
      apiFilePath = path.join(PUBLIC_DIR, pathname, 'index.js');
    }

    if (fs.existsSync(apiFilePath)) {
      try {
        req.body = await getRequestBody(req);

        const mockRes = {
          _status: 200,
          _headers: {},
          setHeader(k, v) { this._headers[k] = v; return this; },
          status(code) { this._status = code; return this; },
          json(data) {
            if (!res.headersSent) {
              res.writeHead(this._status, { ...this._headers, 'Content-Type': 'application/json; charset=utf-8' });
              res.end(JSON.stringify(data));
            }
            return this;
          },
          end(data) {
            if (!res.headersSent) {
              res.writeHead(this._status, this._headers);
              res.end(data);
            }
            return this;
          }
        };

        delete require.cache[require.resolve(apiFilePath)];
        const handler = require(apiFilePath);
        await handler(req, mockRes);
        return;
      } catch (err) {
        console.error('API Error:', err);
        if (!res.headersSent) {
          res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ success: false, error: err.message }));
        }
        return;
      }
    }
  }

  // Handle Static Files
  if (pathname === '/') pathname = '/index.html';
  let filePath = path.join(PUBLIC_DIR, pathname);

  if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
    filePath = filePath + '.html';
  }

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end('<h1>404 Not Found</h1><p>ไม่พบหน้าที่ต้องการ <a href="/">กลับหน้าหลัก</a></p>');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\nJarernGraphic Local Server is running!`);
  console.log(`- Local URL (เครื่องตัวเอง):   http://localhost:${PORT}`);
  console.log(`- Member Portal:             http://localhost:${PORT}/member.html`);
  console.log(`- Admin Dashboard:           http://localhost:${PORT}/admin.html\n`);
});
