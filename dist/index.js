"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const _404_middleware_1 = __importDefault(require("./middlewares/404.middleware"));
const index_1 = __importDefault(require("./db/index"));
const cors_1 = __importDefault(require("cors"));
const ws_1 = __importStar(require("ws"));
const http = __importStar(require("http"));
const verifyWebhook_1 = __importDefault(require("./utils/verifyWebhook"));
class App {
    constructor(controllers, port) {
        this.express = (0, express_1.default)();
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
    initiatializeMiddlewares() {
        this.express.use(express_1.default.json());
        this.express.use((0, cors_1.default)({
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE']
        }));
    }
    static getInstance() {
        return App.instance;
    }
    initiateWebSocket() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.ws = new ws_1.WebSocketServer({ server: this.server });
                // Listen for WebSocket server ready event
                this.ws.on('listening', () => {
                    console.log('WebSocket server created and listening');
                });
                this.ws.on('connection', (ws) => {
                    console.log('Client connected');
                    ws.send('Welcome to Render WebSocket!');
                });
                this.ws.on('error', (error) => {
                    console.error('WebSocket server error:', error);
                });
            }
            catch (error) {
                console.error('Failed to create WebSocket server:', error);
            }
        });
    }
    pushtowebsocket(eventData) {
        // Check if WebSocket server exists and has clients before broadcasting
        if (this.ws && this.ws.clients.size > 0) {
            this.ws.clients.forEach((client) => {
                if (client.readyState === ws_1.default.OPEN) {
                    client.send(eventData);
                }
            });
        }
        else {
            console.log(this.ws.clients.size);
            console.log('No WebSocket clients connected or WebSocket server not ready');
        }
    }
    initializeRoutes() {
        this.express.get("/", (_req, res) => {
            res.json({
                message: "Welcome to the payroll API",
            });
        });
        this.express.get("/api", (_req, res) => {
            res.redirect("/");
        });
        this.controllers.forEach((controller) => {
            this.express.use("/api", controller.router);
        });
    }
    initializeErrorHandling() {
        this.express.use(_404_middleware_1.default);
    }
    webhookHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const eventData = req.body;
            const signature = req.headers["verif-hash"];
            const hashver = process.env.flutterwave_skhash;
            if (!(0, verifyWebhook_1.default)(hashver, signature)) {
                console.log("failed to verify hash");
                res.status(400).json({
                    data: "failed to verify hash"
                });
            }
            this.pushtowebsocket(eventData);
        });
    }
    initializeWebhookRoutes() {
        this.express.post('/api/flw/webhook', this.webhookHandler.bind(this));
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield index_1.default.authenticate();
                console.log('Connection to database complete');
            }
            catch (error) {
                console.error('Unable to connect to database:', error);
            }
        });
    }
    listen() {
        this.server.listen(this.port, () => {
            console.log(`HTTP Server is running on port ${this.port}`);
            console.log(`WebSocket server should be available on the same port`);
        });
    }
}
exports.App = App;
