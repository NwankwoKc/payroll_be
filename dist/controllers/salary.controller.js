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
exports.salary = void 0;
const express_1 = require("express");
const asyncWrapper_1 = __importDefault(require("../utils/asyncWrapper"));
const http_exception_1 = __importDefault(require("../utils/http.exception"));
const user_1 = __importDefault(require("../db/model/user"));
const salary_1 = require("../db/model/salary");
class salary {
    constructor() {
        this.getsalary = (0, asyncWrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const salary = yield salary_1.Salary.findAll();
            if (!salary) {
                throw new http_exception_1.default(404, "No positions found");
            }
            res.status(200).json({
                success: true,
                data: salary,
            });
        }));
        this.createsalary = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const salary = req.body;
                const check = yield salary_1.Salary.findAll({
                    where: {
                        name: salary.name
                    }
                });
                if (check.length > 0) {
                    throw new http_exception_1.default(400, 'salary name already exits');
                }
                const sala = yield salary_1.Salary.create(req.body);
                //update the user table with the salary id
                const user = yield user_1.default.update({
                    salary: sala.id
                }, {
                    where: {
                        id: req.params.id
                    }
                });
                res.status(200).json({
                    success: true
                });
            }
            catch (error) {
                if (error instanceof http_exception_1.default) {
                    res.status(error.status).json({
                        success: false,
                        message: error.message,
                    });
                }
            }
        });
        this.getspecificsalary = (0, asyncWrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const salary = yield salary_1.Salary.findByPk(req.params.id);
            if (!salary) {
                throw new http_exception_1.default(404, "No salary found");
            }
            res.status(200).json({
                success: true,
                data: salary,
            });
        }));
        this.updatesalary = (0, asyncWrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const position = yield salary_1.Salary.update(body, {
                where: {
                    id: req.params.id
                }
            });
            if (!position) {
                throw new http_exception_1.default(404, "No salary found");
            }
            res.status(200).json({
                success: true,
                data: position,
            });
        }));
        this.deletesalary = (0, asyncWrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const salary = yield salary_1.Salary.destroy({
                where: {
                    id: req.params.id
                }
            });
            res.status(200).json({
                success: true
            });
        }));
        this.getspecificsalaryemployee = (0, asyncWrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const salary = yield salary_1.Salary.findByPk(req.params.id, {
                include: [{
                        model: user_1.default,
                        as: 'salary_user'
                    }]
            });
            if (!salary) {
                throw new http_exception_1.default(404, "No salary found");
            }
            res.status(200).json({
                success: true,
                data: salary,
            });
        }));
        this.router = (0, express_1.Router)();
        this.initRoutes();
    }
    initRoutes() {
        ;
        this.router.get("/salary", this.getsalary);
        this.router.post("/salary/:id", this.createsalary);
        this.router.get("/salary/:id", this.getspecificsalary);
        this.router.get("/salary/employee/:id", this.getspecificsalaryemployee);
        this.router.put("/salary/:id", this.updatesalary);
        this.router.delete("/salary/:id", this.deletesalary);
    }
}
exports.salary = salary;
