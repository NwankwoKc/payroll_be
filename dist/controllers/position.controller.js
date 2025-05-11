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
exports.position = void 0;
const express_1 = require("express");
const asyncWrapper_1 = __importDefault(require("../utils/asyncWrapper"));
const http_exception_1 = __importDefault(require("../utils/http.exception"));
const postion_1 = __importDefault(require("../db/model/postion"));
const user_1 = __importDefault(require("../db/model/user"));
class position {
    constructor() {
        this.getpositions = (0, asyncWrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const position = yield postion_1.default.findAll();
            if (!position) {
                throw new http_exception_1.default(404, "No positions found");
            }
            res.status(200).json({
                success: true,
                data: position,
            });
        }));
        this.createpositions = (0, asyncWrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const position = req.body;
            const check = yield postion_1.default.findAll({
                where: {
                    name: position.name
                }
            });
            if (check.length > 0) {
                throw new http_exception_1.default(400, 'department name already exits');
            }
            yield postion_1.default.create(req.body);
            res.status(200).json({
                success: true
            });
        }));
        this.getspecificpositions = (0, asyncWrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const position = yield postion_1.default.findByPk(req.params.id);
            if (!position) {
                throw new http_exception_1.default(404, "No departments found");
            }
            res.status(200).json({
                success: true,
                data: position,
            });
        }));
        this.updatepositions = (0, asyncWrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const position = yield postion_1.default.update(body, {
                where: {
                    id: req.params.id
                }
            });
            if (!position) {
                throw new http_exception_1.default(404, "No departments found");
            }
            res.status(200).json({
                success: true,
                data: position,
            });
        }));
        this.deletepositions = (0, asyncWrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const position = yield postion_1.default.destroy({
                where: {
                    id: req.params.id
                }
            });
            res.status(200).json({
                success: true
            });
        }));
        this.getspecificpositionsemployee = (0, asyncWrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const employee = yield postion_1.default.findByPk(req.params.id, {
                include: [{
                        model: user_1.default,
                        as: 'position_user'
                    }]
            });
            if (!employee) {
                throw new http_exception_1.default(404, "No departments found");
            }
            res.status(200).json({
                success: true,
                data: employee,
            });
        }));
        this.router = (0, express_1.Router)();
        this.initRoutes();
    }
    initRoutes() {
        ;
        this.router.get("/positions", this.getpositions);
        this.router.post("/positions", this.createpositions);
        this.router.get("/positions/:id", this.getspecificpositions);
        this.router.get("/positions/employee/:id", this.getspecificpositionsemployee);
        this.router.put("/positions/:id", this.updatepositions);
        this.router.delete("/positions/:id", this.deletepositions);
    }
}
exports.position = position;
