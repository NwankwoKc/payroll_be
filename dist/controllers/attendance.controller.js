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
const calculate_salary_1 = require("../utils/calculate.salary");
class attendance {
    constructor() {
        this.getattendance = (0, asyncWrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const attendance = yield attendance_1.default.findAll();
            if (!attendance) {
                throw new http_exception_1.default(404, "No attendance found");
            }
            console.log(attendance.createdAt);
            res.status(200).json({
                success: true,
                data: attendance,
            });
        }));
        this.createattendance = (0, asyncWrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const attendance = req.body;
            const id = "f1c8bded-9423-4545-aafe-a0baaaffa0b4";
            attendance.employee_id = id;
            const date = new Date();
            const dateWithoutTime = date.toDateString();
            const check = yield attendance_1.default.findAll({
                where: {
                    employee_id: attendance.employee_id,
                    created_at: dateWithoutTime
                }
            });
            if (check.length > 0) {
                throw new http_exception_1.default(400, 'attendance already exits');
            }
            const hours = date.getHours();
            if (hours > 9) {
                attendance.status = "late";
            }
            else {
                attendance.status = "punctual";
            }
            attendance.created_at = dateWithoutTime;
            yield attendance_1.default.create(req.body);
            (0, calculate_salary_1.calculatesalary)(id);
            res.status(200).json({
                success: true
            });
        }));
        this.getspecificattendance = (0, asyncWrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const attendance = yield attendance_1.default.findAll({
                where: {
                    employee_id: req.params.id
                }
            });
            if (!attendance) {
                throw new http_exception_1.default(404, "No attendance found");
            }
            // const dateString = attendance.created_at
            // const parts = dateString.split(' ');
            // const monthAbbreviation = parts[1]; // "Sep"
            // console.log(monthAbbreviation); // Output: Sep
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
