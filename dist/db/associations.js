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
exports.setupAssociations = void 0;
const user_1 = __importDefault(require("./model/user"));
const payslip_1 = __importDefault(require("./model/payslip"));
const department_1 = __importDefault(require("./model/department"));
const attendance_1 = __importDefault(require("./model/attendance"));
const postion_1 = __importDefault(require("./model/postion"));
const salary_1 = require("./model/salary");
const setupAssociations = (sequelize) => {
    // User -> Payment (One-to-Many)
    user_1.default.hasMany(payslip_1.default, {
        foreignKey: 'employee_id',
        as: 'payments', // Renamed to avoid conflict with User's 'payment' array field
    });
    // Payment -> User (Many-to-One)
    payslip_1.default.belongsTo(user_1.default, {
        foreignKey: 'employee_id',
        as: 'employee',
    });
    // Department -> User (One-to-Many)
    department_1.default.hasMany(user_1.default, {
        foreignKey: 'department',
        as: 'department_users',
    });
    // User -> Department (Many-to-One)
    user_1.default.belongsTo(department_1.default, {
        foreignKey: 'department',
        as: 'employee_department',
    });
    //User -> Attendance (One-to-Many)
    user_1.default.hasMany(attendance_1.default, {
        foreignKey: 'employee_id',
        as: 'attendances',
    });
    // Attendance -> User (Many-to-One)
    attendance_1.default.belongsTo(user_1.default, {
        foreignKey: 'employee_id',
        as: 'employee_attendance',
    });
    //position -> user (One-to-Many)
    postion_1.default.hasMany(user_1.default, {
        foreignKey: 'position',
        as: 'position_user'
    });
    //user -> position (Many-to-One)
    user_1.default.belongsTo(postion_1.default, {
        foreignKey: 'position',
        as: 'user_position'
    });
    //salary -> user (One-to-Many)
    salary_1.Salary.hasMany(user_1.default, {
        foreignKey: 'salary',
        as: 'salary_user'
    });
    //user -> salary (Many-to-One)
    user_1.default.belongsTo(salary_1.Salary, {
        foreignKey: 'salary',
        as: 'user_salary'
    });
    // Hooks for managing Department's `employees` array
    user_1.default.afterCreate((user) => __awaiter(void 0, void 0, void 0, function* () {
        if (user.department) {
            yield department_1.default.update({ employees: sequelize.fn('array_append', sequelize.col('employees'), user.id) }, { where: { id: user.department } });
        }
    }));
    user_1.default.afterDestroy((user) => __awaiter(void 0, void 0, void 0, function* () {
        if (user.department) {
            yield department_1.default.update({ employees: sequelize.fn('array_remove', sequelize.col('employees'), user.id) }, { where: { id: user.department } });
        }
    }));
};
exports.setupAssociations = setupAssociations;
