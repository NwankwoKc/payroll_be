"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controller_1 = require("../controllers/auth/auth.controller");
const index_1 = require("../index");
const dotenv_1 = __importDefault(require("dotenv"));
const user_controller_1 = require("../controllers/user.controller");
const department_controller_1 = require("../controllers/department.controller");
const payslip_controller_1 = require("../controllers/payslip.controller");
const attendance_controller_1 = require("../controllers/attendance.controller");
const position_controller_1 = require("../controllers/position.controller");
const salary_controller_1 = require("../controllers/salary.controller");
const paystack_controller_1 = __importDefault(require("../controllers/paystack.controller"));
dotenv_1.default.config();
const app = new index_1.App([new auth_controller_1.AuthController(), new user_controller_1.user(), new department_controller_1.department(), new payslip_controller_1.Payslip(), new attendance_controller_1.attendance(), new position_controller_1.position(), new salary_controller_1.salary(), new user_controller_1.user(), new paystack_controller_1.default()], process.env.PORT || 3000).express;
exports.default = app;
