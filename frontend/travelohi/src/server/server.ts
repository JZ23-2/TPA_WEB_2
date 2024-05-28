import { Server, Socket } from 'socket.io';
import http from 'http';
import express from 'express';
import cors from 'cors';
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});
app.use(cors());

interface Player {
  id: number;
  socket: Socket;
}

const players: Player[] = [];

io.on("connection", (socket) => {
  console.log("A user connected");

  const playerId = players.length + 1;
  const newPlayer: Player = { id: playerId, socket: socket };
  if(players.length === 2){
    console.log("Room is full");
    socket.emit("roomFull")
    return
  }
  players.push(newPlayer);

  socket.emit("playerId", playerId);

  socket.on("enterGame", (data :{playerId:number,heroPositionX:number,heroPositionY:number,enemyPositionX:number,enemyPositionY:number,action:string,heroHealth:number,enemyHealth:number}) => {
    socket.broadcast.emit("broadCastMessage",{heroPositionX:data.heroPositionX,heroPositionY:data.heroPositionY,enemyPositionX:data.enemyPositionX,enemyPositionY:data.enemyPositionY,action:data.action,heroHealth:data.heroHealth,enemyHealth:data.enemyHealth})
    console.log(`Player ${data.playerId} says: ${data.heroPositionX} ${data.heroPositionY},${data.action}`);
    if(data.action === "right" && data.playerId === 1){
      io.emit("opponentAction",{playerId:data.playerId,action:data.action,heroPositionX:data.heroPositionX + 15,heroPositionY:data.heroPositionY,heroHealth:data.heroHealth})
    }else if(data.action === "idle" && data.playerId === 1){
      io.emit("opponentAction",{playerId:data.playerId,action:data.action,heroPositionX:data.heroPositionX,heroPositionY:data.heroPositionY,heroHealth:data.heroHealth})
    }else if(data.action === "left" && data.playerId === 1){
      io.emit("opponentAction",{playerId:data.playerId,action:data.action,heroPositionX:data.heroPositionX - 15,heroPositionY:data.heroPositionY,heroHealth:data.heroHealth})
    }else if(data.action === "left" && data.playerId === 2){
      io.emit("opponentAction",{playerId:data.playerId,action:data.action,enemyPositionX:data.enemyPositionX - 15,enemyPositionY:data.enemyPositionY,enemyHealth:data.enemyHealth})
    }else if(data.action === "idle" && data.playerId === 2){
      io.emit("opponentAction",{playerId:data.playerId,action:data.action,enemyPositionX:data.enemyPositionX,enemyPositionY:data.enemyPositionY,enemyHealth:data.enemyHealth})
    }else if(data.action === "right" && data.playerId === 2){
      io.emit("opponentAction",{playerId:data.playerId,action:data.action,enemyPositionX:data.enemyPositionX + 15,enemyPositionY:data.enemyPositionY,enemyHealth:data.enemyHealth})
    }else if(data.action === "rightFrontKick" && data.playerId === 1){
      io.emit("opponentAction",{playerId:data.playerId,action:data.action,heroPositionX:data.heroPositionX,heroPositionY:data.heroPositionY,heroHealth:data.heroHealth})
    }else if(data.action === "rightFrontMirrorKick" && data.playerId === 1){
      io.emit("opponentAction",{playerId:data.playerId,action:data.action,heroPositionX:data.heroPositionX,heroPositionY:data.heroPositionY,heroHealth:data.heroHealth})
    }else if(data.action === "rightLowKick" && data.playerId === 1){
      io.emit("opponentAction",{playerId:data.playerId,action:data.action,heroPositionX:data.heroPositionX,heroPositionY:data.heroPositionY,heroHealth:data.heroHealth})
    }else if(data.action === "leftLowKick" && data.playerId === 1){
      io.emit("opponentAction",{playerId:data.playerId,action:data.action,heroPositionX:data.heroPositionX,heroPositionY:data.heroPositionY,heroHealth:data.heroHealth})
    }else if(data.action === "damageRightFrontKick" && data.playerId === 1){
      io.emit("opponentAction",{playerId:data.playerId,action:data.action,heroPositionX:data.heroPositionX,heroPositionY:data.heroPositionY,heroHealth:data.heroHealth,enemyHealth:data.enemyHealth - 10})
    }else if(data.action === "damageRightMirrorFrontKick" && data.playerId === 1){
      io.emit("opponentAction",{playerId:data.playerId,action:data.action,heroPositionX:data.heroPositionX,heroPositionY:data.heroPositionY,heroHealth:data.heroHealth,enemyHealth:data.enemyHealth - 10})
    }else if(data.action === "damageRightLowKick" && data.playerId === 1){
      io.emit("opponentAction",{playerId:data.playerId,action:data.action,heroPositionX:data.heroPositionX,heroPositionY:data.heroPositionY,heroHealth:data.heroHealth,enemyHealth:data.enemyHealth - 15})
    }else if(data.action === "damageLeftLowKick" && data.playerId === 1){
      io.emit("opponentAction",{playerId:data.playerId,action:data.action,heroPositionX:data.heroPositionX,heroPositionY:data.heroPositionY,heroHealth:data.heroHealth,enemyHealth:data.enemyHealth - 15})
    }else if(data.action === "rightFrontMirrorKick" && data.playerId === 2){
      io.emit("opponentAction",{playerId:data.playerId,action:data.action,enemyPositionX:data.enemyPositionX,enemyPositionY:data.enemyPositionY,enemyHealth:data.enemyHealth})
    }else if(data.action === "rightFrontKick" && data.playerId === 2){
      io.emit("opponentAction",{playerId:data.playerId,action:data.action,enemyPositionX:data.enemyPositionX,enemyPositionY:data.enemyPositionY,enemyHealth:data.enemyHealth})
    }else if(data.action === "enemyRightLowKick" && data.playerId === 2){
      io.emit("opponentAction",{playerId:data.playerId,action:data.action,enemyPositionX:data.enemyPositionX,enemyPositionY:data.enemyPositionY,enemyHealth:data.enemyHealth})
    }else if(data.action === "enemyLeftLowKick" && data.playerId === 2){
      io.emit("opponentAction",{playerId:data.playerId,action:data.action,enemyPositionX:data.enemyPositionX,enemyPositionY:data.enemyPositionY,enemyHealth:data.enemyHealth})
    }else if(data.action === "damageEnemyRightFrontKick" && data.playerId === 2){
      io.emit("opponentAction",{playerId:data.playerId,action:data.action,enemyPositionX:data.enemyPositionX,enemyPositionY:data.enemyPositionY,heroHealth:data.heroHealth-10,enemyHealth:data.enemyHealth})
    }else if(data.action === "damageEnemyRightMirrorFrontKick" && data.playerId === 2){
      io.emit("opponentAction",{playerId:data.playerId,action:data.action,enemyPositionX:data.enemyPositionX,enemyPositionY:data.enemyPositionY,heroHealth:data.heroHealth-10,enemyHealth:data.enemyHealth})
    }else if(data.action === "damageEnemyRightLowKick" && data.playerId === 2){
      io.emit("opponentAction",{playerId:data.playerId,action:data.action,enemyPositionX:data.enemyPositionX,enemyPositionY:data.enemyPositionY,heroHealth:data.heroHealth-15,enemyHealth:data.enemyHealth})
    }else if(data.action === "damageEnemyLeftLowKick" && data.playerId === 2){
      io.emit("opponentAction",{playerId:data.playerId,action:data.action,enemyPositionX:data.enemyPositionX,enemyPositionY:data.enemyPositionY,heroHealth:data.heroHealth-15,enemyHealth:data.enemyHealth})
    }
    
  })

  

  socket.on("disconnect", () => {
    console.log("A user disconnected");
    const index = players.findIndex((player) => player.id === playerId);
    console.log(index);
    if (index !== -1) {
      players.splice(index, 1);
    }
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
