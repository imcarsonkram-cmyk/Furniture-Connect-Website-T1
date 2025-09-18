// Lightweight custom server placeholder (moved from app/server.js)
// This is optional — Next's dev server does not require a custom server.
// Keep here only if you intend to run `node server.js` as a custom server.

const { createServer } = require('http');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    // simple passthrough to Next
    handle(req, res);
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log('> Custom Next server listening on http://localhost:3000');
  });
});
