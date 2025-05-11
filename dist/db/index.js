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
exports.Department = exports.Payment = exports.User = exports.sequelize = void 0;
const { Sequelize } = require('sequelize');
const user_1 = __importDefault(require("./model/user"));
exports.User = user_1.default;
const payslip_1 = __importDefault(require("./model/payslip"));
exports.Payment = payslip_1.default;
const department_1 = __importDefault(require("./model/department"));
exports.Department = department_1.default;
const postion_1 = __importDefault(require("./model/postion"));
const associations_1 = require("./associations");
const salary_1 = require("./model/salary");
const attendance_1 = __importDefault(require("./model/attendance"));
const leave_1 = __importDefault(require("./model/leave"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sequelize = new Sequelize(process.env.databaseurl || "postgresql://postgres.jtdjpjsmhglhmybdaida:plmoknijb101@aws-0-eu-west-2.pooler.supabase.com:6543/postgres");
exports.sequelize = sequelize;
user_1.default.initialize(sequelize);
payslip_1.default.initialize(sequelize);
department_1.default.initialize(sequelize);
postion_1.default.initialize(sequelize);
salary_1.Salary.initialize(sequelize);
attendance_1.default.initialize(sequelize);
leave_1.default.initialize(sequelize);
// Set up associations
(0, associations_1.setupAssociations)(sequelize);
// Sync database
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelize.sync({
            force: false
        });
        console.log('Database synced!');
    }
    catch (error) {
        console.error('Error syncing database:', error);
    }
}))();
exports.default = sequelize;
