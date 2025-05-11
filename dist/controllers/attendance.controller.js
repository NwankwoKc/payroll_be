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
exports.attendance = void 0;
const express_1 = require("express");
const asyncWrapper_1 = __importDefault(require("../utils/asyncWrapper"));
const http_exception_1 = __importDefault(require("../utils/http.exception"));
const attendance_1 = __importDefault(require("../db/model/attendance"));
class attendance {
    constructor() {
        this.getattendance = (0, asyncWrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const attendance = yield attendance_1.default.findAll();
            if (!attendance) {
                throw new http_exception_1.default(404, "No attendance found");
            }
            res.status(200).json({
                success: true,
                data: attendance,
            });
        }));
        this.createattendance = (0, asyncWrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const attendance = req.body;
            const check = yield attendance_1.default.findAll({
                where: {
                    employee_id: attendance.employee_id,
                }
            });
            if (check) {
                throw new http_exception_1.default(400, 'attendance already exits');
            }
            const date = new Date();
            const hours = date.getHours();
            if (hours > 9) {
                attendance.status = "late";
            }
            else {
                attendance.status = "punctual";
            }
            yield attendance_1.default.create(req.body);
            res.status(200).json({
                success: true
            });
        }));
        this.getspecificattendance = (0, asyncWrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const attendance = yield attendance_1.default.findByPk(req.params.id);
            if (!attendance) {
                throw new http_exception_1.default(404, "No attendance found");
            }
            res.status(200).json({
                success: true,
                data: attendance
            });
        }));
        this.updateattendance = (0, asyncWrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const attendance = req.body;
            const check = yield attendance_1.default.update(attendance, {
                where: {
                    id: req.params.id
                }
            });
            if (!check) {
                throw new http_exception_1.default(404, "No attendance found");
            }
            res.status(200).json({
                success: true,
                data: check,
            });
        }));
        this.deleteattendance = (0, asyncWrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const attendance = yield attendance_1.default.destroy({
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
        this.router.get("/attendance", this.getattendance);
        this.router.post("/attendance", this.createattendance);
        this.router.get("/attendance/:id", this.getspecificattendance);
        this.router.put("/attendance/:id", this.updateattendance);
        this.router.delete("/attendance/:id", this.deleteattendance);
    }
}
exports.attendance = attendance;
