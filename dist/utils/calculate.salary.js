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
exports.calculatesalary = void 0;
const attendance_1 = __importDefault(require("../db/model/attendance"));
const sequelize_1 = require("sequelize");
const user_1 = __importDefault(require("../db/model/user"));
const salary_1 = require("../db/model/salary");
//calculating salary based on attendance
const calculatesalary = (ids) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let date = new Date();
    let id = ids;
    const att = yield attendance_1.default.findAll({
        where: {
            employee_id: id,
            [sequelize_1.Op.and]: [
                sequelize_1.Sequelize.literal(`EXTRACT(YEAR FROM "createdAt") = ${date.getFullYear()}`),
                sequelize_1.Sequelize.literal(`EXTRACT(MONTH FROM "createdAt") = ${date.getMonth() + 1}`),
            ],
        }
    });
    const count = att.length;
    const usersalary = yield user_1.default.findOne({
        where: {
            id: id
        },
        attributes: ['salary']
    });
    if (!usersalary) {
        return;
    }
    const usersala = (_a = usersalary.salary) === null || _a === void 0 ? void 0 : _a.toString();
    const salary = yield salary_1.Salary.findOne({
        where: {
            id: usersala
        },
        attributes: ['amount'],
    });
    if (!salary) {
        return;
    }
    const sala = salary.amount * count;
    const [affectedCount] = yield user_1.default.update({
        amount: sala // or use Sequelize.literal for operations
    }, {
        where: {
            id: id // your condition
        }
    });
    if (affectedCount === 0) {
        throw new Error('User not found or no changes made');
    }
    console.log(sala);
    return sala;
});
exports.calculatesalary = calculatesalary;
