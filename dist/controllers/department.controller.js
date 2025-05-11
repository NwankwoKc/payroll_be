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
exports.department = void 0;
const express_1 = require("express");
const asyncWrapper_1 = __importDefault(require("../utils/asyncWrapper"));
const http_exception_1 = __importDefault(require("../utils/http.exception"));
const department_1 = __importDefault(require("../db/model/department"));
const user_1 = __importDefault(require("../db/model/user"));
class department {
    constructor() {
        this.getdepartment = (0, asyncWrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const department = yield department_1.default.findAll();
            if (!department) {
                throw new http_exception_1.default(404, "No departments found");
            }
            res.status(200).json({
                success: true,
                data: department,
            });
        }));
        this.createdepartment = (0, asyncWrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const departmentbody = req.body;
            const check = yield department_1.default.findAll({
                where: {
                    name: departmentbody.name
                }
            });
            if (check.length > 0) {
                throw new http_exception_1.default(400, 'department name already exits');
            }
            yield department_1.default.create(req.body);
            res.status(200).json({
                success: true
            });
        }));
        this.getspecificdepartment = (0, asyncWrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const department = yield department_1.default.findByPk(req.params.id);
            if (!department) {
                throw new http_exception_1.default(404, "No departments found");
            }
            res.status(200).json({
                success: true,
                data: department,
            });
        }));
        this.updatedepartment = (0, asyncWrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const department = yield department_1.default.update(body, {
                where: {
                    id: req.params.id
                }
            });
            if (!department) {
                throw new http_exception_1.default(404, "No departments found");
            }
            res.status(200).json({
                success: true,
                data: department,
            });
        }));
        this.deletedepartment = (0, asyncWrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const department = yield department_1.default.destroy({
                where: {
                    id: req.params.id
                }
            });
            res.status(200).json({
                success: true
            });
        }));
        this.getspecificdepartmentemployee = (0, asyncWrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const employee = yield department_1.default.findByPk(req.params.id, {
                include: [{
                        model: user_1.default,
                        as: 'department_users'
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
        this.router.get("/departments", this.getdepartment);
        this.router.post("/departments", this.createdepartment);
        this.router.get("/departments/:id", this.getspecificdepartmentemployee);
        this.router.put("/departments/:id", this.updatedepartment);
        this.router.delete("/departments/:id", this.deletedepartment);
    }
}
exports.department = department;
