const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

let players = [];

wss.on('connection', (ws) => {
  ws.playerName = null;

  ws.on('message', (data) => {
    const msg = JSON.parse(data);

    if (msg.type === "join") {
      ws.playerName = msg.name;
      players.push(ws);
      console.log(`Pemain ${msg.name} bergabung.`);

      if (players.length === 2) {
        let countdown = 3;
        const interval = setInterval(() => {
          players.forEach(p => p.send(`countdown:${countdown}`));
          countdown--;
          if (countdown < 0) {
            clearInterval(interval);
            players.forEach(p => p.send("start"));
          }
        }, 1000);
      }
    }

    if (msg.type === "click") {
      if (players.includes(ws)) {
        players.forEach(p => p.send(`win:${msg.name}`));
        players = []; // Reset game
      }
    }
  });

  ws.on('close', () => {
    console.log('Pemain keluar');
    players = players.filter(p => p !== ws);
  });
});

console.log('Server WebSocket berjalan di ws://localhost:8080');
