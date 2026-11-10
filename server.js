const http = require('http');
const games = {};
const PORT = process.env.PORT || 3000;

setInterval(function () {
  const now = Date.now();
  Object.keys(games).forEach(function (g) {
    Object.keys(games[g]).forEach(function (id) {
      if (now - games[g][id].t > 60000) { delete games[g][id]; }
    });
    if (!Object.keys(games[g]).length) { delete games[g]; }
  });
}, 30000);

const server = http.createServer(function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
  if (req.method === 'POST' && req.url === '/pos') {
    let body = '';
    req.on('data', function (c) {
      body += c;
      if (body.length > 4000) { req.destroy(); }
    });
    req.on('end', function () {
      let d;
      try { d = JSON.parse(body); } catch (e) { res.writeHead(400); res.end('bad'); return; }
      if (typeof d.game !== 'string' || typeof d.id !== 'string' || d.game.length > 20 || d.id.length > 20 || typeof d.lat !== 'number' || typeof d.lng !== 'number') {
        res.writeHead(400); res.end('bad'); return;
      }
      if (!games[d.game]) { games[d.game] = {}; }
      games[d.game][d.id] = {
        id: d.id,
        team: d.team === 'blue' ? 'blue' : 'red',
        lat: d.lat,
        lng: d.lng,
        acc: Math.min(Number(d.acc) || 50, 500),
        t: Date.now()
      };
      const now = Date.now();
      const others = Object.keys(games[d.game]).map(function (k) { return games[d.game][k]; }).filter(function (p) {
        return p.id !== d.id && now - p.t < 30000;
      });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ others: others }));
    });
    return;
  }
  res.writeHead(200);
  res.end('ok');
});

server.listen(PORT);
