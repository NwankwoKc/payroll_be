import express, { Application, Request, Response } from "express";
import { Controller } from "./interfaces/controllerInterface"
import pageNotFoundMiddleware from "./middlewares/404.middleware";
import errorMiddleware from "./middlewares/error.middleware";
import sequelize from "./db/index";
import cors from 'cors'
import WebSocket, { WebSocketServer } from 'ws';
import * as http from 'http'

export class App {
  public express: Application;
  private controllers: Controller[];
  private port: number;
  public ws: WebSocketServer | undefined;
  private server: http.Server;
  private static instance: App; 

  constructor(controllers: Controller[], port: number) {
    this.express = express();
    this.port = port;
    this.controllers = controllers;
    this.server = http.createServer(this.express);

    this.initiatializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.connect();
    this.initiateWebSocket(); // Call this after server creation
  }

  private initiatializeMiddlewares() {
    this.express.use(express.json());
    this.express.use(cors({
      origin: '*',
      methods: ['GET','POST','PUT','DELETE']
    }));
  }
  public static getInstance(): App {
    return App.instance;
  }
  private async initiateWebSocket() {
    try {
      this.ws = new WebSocketServer({ server: this.server });
      
      // Listen for WebSocket server ready event
      this.ws.on('listening', () => {
        console.log('WebSocket server created and listening');
      });
      
      this.ws.on('connection', (ws: WebSocket) => {
        console.log('Client connected');
        ws.send('Welcome to Render WebSocket!');
      });
      
      this.ws.on('error', (error) => {
        console.error('WebSocket server error:', error);
      });
      
    } catch (error) {
      console.error('Failed to create WebSocket server:', error);
    }
  }

  private initializeRoutes() {
    this.express.get("/", (_req: Request, res: Response) => {
      res.json({
        message: "Welcome to the payroll API",
      });
    });

    this.express.get("/api", (_req: Request, res: Response) => {
      res.redirect("/");
    });

    this.controllers.forEach((controller) => {
      this.express.use("/api", controller.router);
    });
  }

  private initializeErrorHandling(): void {
    this.express.use(pageNotFoundMiddleware);
  }

  private async connect() {
    try {
      await sequelize.authenticate();
      console.log('Connection to database complete');
    } catch (error) {
      console.error('Unable to connect to database:', error);
    }
  }

  public listen() {
    this.server.listen(this.port, () => {
      console.log(`HTTP Server is running on port ${this.port}`);
      console.log(`WebSocket server should be available on the same port`);
    });
  }
}