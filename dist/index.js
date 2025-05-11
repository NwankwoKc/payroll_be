"use strict";
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
// import cookieParser from "cookie-parser";
// import cors from "cors";
const _404_middleware_1 = __importDefault(require("./middlewares/404.middleware"));
const index_1 = __importDefault(require("./db/index"));
const console_1 = require("console");
class App {
    constructor(controllers, port) {
        this.express = (0, express_1.default)();
        this.port = port;
        this.controllers = controllers;
        this.initiatializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandling();
        this.connect();
    }
    initiatializeMiddlewares() {
        // this.express.use(cors());
        this.express.use(express_1.default.json());
        // this.express.use(cookieParser());
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
        // catch 404 and forward to error handler
        this.express.use(_404_middleware_1.default);
        // error handler
        // this.express.use(errorMiddleware);
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                index_1.default.authenticate().then(console.log('connection to database complete'));
            }
            catch (_a) {
                console.error('unable to connect to database', console_1.error);
            }
        });
    }
    listen() {
        this.express.listen(this.port, () => {
            console.log(`app listening on port ${this.port}`);
        });
    }
}
exports.App = App;
