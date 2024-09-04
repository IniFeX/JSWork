const express = require('express');
const cors = require('cors');
// const socketIo = require('socket.io');

const app = express();
const port = 3000;


const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:8080',
    // methods: ['GET', 'POST']
  }
})

app.use(cors({
  origin: 'http://localhost:8080',
}));
app.use(express.json());

// const server = http.createServer(app);
// const io = socketIo(server);
let connectedClients = 0;

io.on('connection', (socket) => {
  console.log('Новое соединение установлено');

  connectedClients++;
  io.sockets.emit('connected_clients', connectedClients); // Отправить количество подключенных клиентов всем клиентам

  // socket.on('disconnect', () => {
  //   connectedClients--;
  //   io.sockets.emit('connected_clients', connectedClients); // Отправить количество подключенных клиентов всем клиентам
  // });
});

function isChecker(index) {
  return (
    (Math.floor(index / 8) % 2 === 0 ? index % 2 === 1 : index % 2 === 0) &&
    (index < 24 || index >= 40)
  );
}

function setColor(index){
  if(!isChecker(index)){
    return null
  }
  else if(index < 24 && isChecker(index)){
    return "black-checker"
  }
  else if(index >= 40 && isChecker(index)){
    return "white-checker"
  }
}


let boardStart = Array.from({ length: 64 }, (_, index) => ({
  id: [Math.floor(index / 8), index % 8],
  index: index,
  color: (Math.floor(index / 8) + index) % 2 === 0 ? "white" : "black",
  hasChecker: isChecker(index),
  checkerColor: setColor(index),
  isQueen: /*false*/ index === 44 || index === 21 || index === 23,
}));


let board = Array.from({ length: 64 }, (_, index) => ({
  id: [Math.floor(index / 8), index % 8],
  index: index,
  color: (Math.floor(index / 8) + index) % 2 === 0 ? "white" : "black",
  hasChecker: isChecker(index),
  checkerColor: setColor(index),
  isQueen: /*false*/index === 44 || index === 21 || index === 23,
}));

let validCheckers = [];
let moves = [];
let player = 'white-checker';
let mode = null;

app.get('/board', (req, res) => {
  // board[46].isQueen = true;
  // board[44].isQueen = true;
  res.json(board);
});

app.get('/restart', (req, res) => {
  res.json(boardStart);
});

app.get('/move', (req, res) => {
  res.json(moves);
});

app.get('/state', (req, res) => {
  res.json(player);
})

app.get('/mode', (req, res) => {
  // console.log(mode)
  res.json(mode);
})

app.get('/bot', (req, res) => {
  // const [randBlackChecker, randMove] = setTimeout(botAI, 2000, validCheckers) ;
  // setValid(validCheckers);
  const [randBlackChecker, randMove] = botAI(validCheckers) ;

  res.json(
    [randBlackChecker, randMove]
    // setTimeout(botAI, 1000)
  );
})

app.post('/state', (req, res) => {
  player = req.body;
  res.sendStatus(200);
});

app.post('/board', (req, res) => {
  board = req.body;
  res.sendStatus(200);
});

app.post('/saveMode', (req, res) => {
  // console.log("save")
  // console.log(req.body)
  mode = req.body;
  res.sendStatus(200);
});
app.post('/move', (req,res) => {
  moves = req.body;
  res.sendStatus(200);
})

app.post('/botPost', (req,res)=>{
  validCheckers = req.body;
  res.sendStatus(200);
})
// app.post('/restart', (req,res) => {
//   boardStart = req.body;
//   res.sendStatus(200);
// })

function botAI(validCheckers) {
  const randomBlackCheckerIndex = Math.floor(
    Math.random() * validCheckers.length
  );
  const randBlackChecker = validCheckers[randomBlackCheckerIndex];

  const randomBotMoveIndex = Math.floor(
    Math.random() * randBlackChecker[1].length
  );
  const randMove = randBlackChecker[1][randomBotMoveIndex];

  const newRandBlackChecker = randBlackChecker[0];

  return [newRandBlackChecker, randMove];
}

http.listen(port, () => {
  console.log(`Server with http is running on http://localhost:${port}`);
});
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });