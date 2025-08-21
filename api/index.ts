import express, { Application, Request, Response } from "express";
import { Controller } from "./interfaces/controllerInterface"
import pageNotFoundMiddleware from "./middlewares/404.middleware";
import errorMiddleware from "./middlewares/error.middleware";
import sequelize from "./db/index";
import cors from 'cors'
import WebSocket, { WebSocketServer } from 'ws';
import * as http from 'http'
import verify from "./utils/verifyWebhook";
import { processRecipientResult } from "./controllers/webhook.controller";

export class App {
  public express: Application;
  private controllers: Controller[];
  private port: number;
  ws!: WebSocketServer
  private server: http.Server;
  public static instance: App; 

  constructor(controllers: Controller[], port: number) {
    this.express = express();
    this.port = port;
    this.controllers = controllers;
    this.server = http.createServer(this.express);
    this.initiatializeMiddlewares();
    this.initializeRoutes();
    this.initializeWebhookRoutes();
    this.connect();
    this.initiateWebSocket(); // Call this after server creation
    this.initializeErrorHandling();
    App.instance = this;
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
      this.ws = new WebSocketServer({server: this.server});
      
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

  private pushtowebsocket(eventData:any){
     // Check if WebSocket server exists and has clients before broadcasting
    if (this.ws && this.ws.clients.size > 0) {
        this.ws.clients.forEach((client: WebSocket) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(eventData));
            }
        });
    } else {
        console.log(this.ws.clients.size )
        console.log('No WebSocket clients connected or WebSocket server not ready');
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

  private async webhookHandler(req: Request, res: Response) {
    const eventData = req.body;
    const signature = req.headers["verif-hash"] as string;
    const hashver = process.env.flutterwave_skhash as string;
     if (!verify(hashver, signature)) {
            console.log("failed to verify hash");
             res.status(400).json({
                data: "failed to verify hash"
          });
      }
        this.pushtowebsocket(eventData);
        processRecipientResult(eventData);
        
      res.status(200).json({ 
      status: "success", 
      message: "Webhook received" 
    });
        
  }
  initializeWebhookRoutes() {
    this.express.post('/api/flw/webhook', this.webhookHandler.bind(this));
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