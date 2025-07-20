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
exports.Payslip = void 0;
const express_1 = require("express");
const asyncWrapper_1 = __importDefault(require("../utils/asyncWrapper"));
const http_exception_1 = __importDefault(require("../utils/http.exception"));
const payslip_1 = __importDefault(require("../db/model/payslip"));
class Payslip {
    constructor() {
        this.getpayslip = (0, asyncWrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const check = yield payslip_1.default.findAll();
            if (!check) {
                throw new http_exception_1.default(404, "No departments found");
            }
            res.status(200).json({
                success: true,
                data: check,
            });
        }));
        this.createpayslip = (0, asyncWrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const payment = req.body;
            const bulkreference = req.params.bulk_reference;
        }));
        this.getspecificpayslip = (0, asyncWrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const check = yield payslip_1.default.findByPk(req.params.id);
            if (!check) {
                throw new http_exception_1.default(404, "No departments found");
            }
            res.status(200).json({
                success: true,
                data: check,
            });
        }));
        this.updatepayslip = (0, asyncWrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const check = yield payslip_1.default.update(body, {
                where: {
                    id: req.params.id
                }
            });
            if (!check) {
                throw new http_exception_1.default(404, "No departments found");
            }
            res.status(200).json({
                success: true,
                data: check,
            });
        }));
        this.deletepayslip = (0, asyncWrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const check = yield payslip_1.default.destroy({
                where: {
                    id: req.params.id
                }
            });
            res.status(200).json({
                success: true
            });
        }));
        this.router = (0, express_1.Router)();
        this.initRoutes();
    }
    initRoutes() {
        ;
        this.router.get("/payments", this.getpayslip);
        this.router.post("/payments/:bulk_reference", this.createpayslip);
        this.router.get("/payments/:id", this.getspecificpayslip);
        this.router.put("/payments/:id", this.updatepayslip);
        this.router.delete("/payments/:id", this.deletepayslip);
    }
}
exports.Payslip = Payslip;
