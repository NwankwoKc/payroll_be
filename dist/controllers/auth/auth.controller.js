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
exports.AuthController = void 0;
const express_1 = require("express");
const asyncWrapper_1 = __importDefault(require("../../utils/asyncWrapper"));
const http_exception_1 = __importDefault(require("../../utils/http.exception"));
const user_1 = __importDefault(require("../../db/model/user"));
// import { db } from "../../db/models";
require("dotenv/config");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_controller_1 = require("../user.controller");
class AuthController {
    constructor() {
        this.login = (0, asyncWrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            let loginData = req.body;
            const existingUser = yield user_1.default.findOne({
                where: { email: loginData.email },
            });
            if (!existingUser) {
                throw new http_exception_1.default(401, "Invalid login credentials");
            }
            const isPasswordValid = yield bcryptjs_1.default.compareSync(req.body.password, existingUser.password);
            if (!isPasswordValid) {
                throw new http_exception_1.default(401, "Invalid login credentials");
            }
            const uid = existingUser === null || existingUser === void 0 ? void 0 : existingUser.id;
            const payload = {
                uid: uid,
            };
            res.status(200).json({
                success: true,
                user: user_controller_1.user
            });
        }));
        this.router = (0, express_1.Router)();
        this.initRoutes();
    }
    initRoutes() {
        ;
        this.router.post("/auth/login", this.login);
    }
}
exports.AuthController = AuthController;
