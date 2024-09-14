import dotenv from "dotenv";
import cors from "cors";
import express, { NextFunction, Request, Response,Express } from "express";
import connectDB from "./config/database";
import route from "./route";
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

dotenv.config({ path: "./config.env" });

const app:Express = express();
const port = process.env.PORT || 5001;

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

// io.listen(5000);

// io.on('connection', (socket) => {
//   console.log('A user connected');

//   socket.on('flowData', (data) => {
//     console.log('Received flow data:', data);
//     // Broadcast the data to all connected clients
//     socket.broadcast.emit('flowData', data);
//   });
//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//   });

// });

connectDB();

const corsOptions = {
  origin: ["http://localhost", "http://localhost:3000"],
  credentials: true,
};

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", corsOptions.origin.join(", "));
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(cors(corsOptions));

// Serve static files from "uploads" directory if needed
// app.use('/', express.static('uploads'));

app.use("/api/v1/auth", route);

app.listen(port, () => {
  console.log(`Server is working on http://localhost:${port}`);
});

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running");
});
