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
    public ws!: WebSocketServer;
    private server: http.Server;
    public static instance: App;
    private errorHandlingInitialized: boolean = false;
    
    constructor(controllers: Controller[], port: number) {
        // Set instance FIRST
        App.instance = this;
        
        this.express = express();
        this.port = port;
        this.controllers = controllers;
        this.server = http.createServer(this.express);
        
        this.initiatializeMiddlewares();
        this.initializeRoutes();
        // Don't initialize error handling yet - wait for all controllers
        this.connect();
        this.initiateWebSocket();
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

    // Method to add controllers after initialization
    public addController(controller: Controller) {
        this.controllers.push(controller);
        this.express.use("/api", controller.router);
    }

    // Method to finalize initialization (call this after adding all controllers)
    public finalizeInitialization() {
        if (!this.errorHandlingInitialized) {
            this.initializeErrorHandling();
            this.errorHandlingInitialized = true;
        }
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
        // Initialize error handling before starting server if not done already
        this.finalizeInitialization();
        
        this.server.listen(this.port, () => {
            console.log(`HTTP Server is running on port ${this.port}`);
            console.log(`WebSocket server should be available on the same port`);
        });
    }
}