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
const sequelize_1 = require("sequelize");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class User extends sequelize_1.Model {
    static initialize(sequelize) {
        {
            User.init({
                id: {
                    type: sequelize_1.DataTypes.UUID,
                    defaultValue: sequelize_1.DataTypes.UUIDV4,
                    primaryKey: true,
                    allowNull: false,
                },
                firstname: {
                    type: sequelize_1.DataTypes.TEXT,
                    allowNull: false
                },
                lastname: {
                    type: sequelize_1.DataTypes.TEXT,
                    allowNull: false
                },
                department: {
                    type: sequelize_1.DataTypes.UUID,
                    allowNull: false,
                    references: {
                        model: 'department',
                        key: 'id'
                    }
                },
                experience: {
                    type: sequelize_1.DataTypes.TEXT
                },
                email: {
                    type: sequelize_1.DataTypes.TEXT,
                    allowNull: false
                },
                password: {
                    type: new sequelize_1.DataTypes.TEXT(),
                    allowNull: false
                },
                position: {
                    type: sequelize_1.DataTypes.UUID,
                    allowNull: false,
                    references: {
                        model: 'position',
                        key: 'id'
                    }
                },
                hiredate: {
                    type: sequelize_1.DataTypes.DATE
                },
                sex: {
                    type: sequelize_1.DataTypes.ENUM('Male', 'Female'),
                    allowNull: false
                },
                phonenumber: {
                    type: sequelize_1.DataTypes.TEXT,
                    allowNull: false
                },
                jobtitle: {
                    type: sequelize_1.DataTypes.TEXT,
                    defaultValue: sequelize_1.DataTypes.UUIDV4,
                    allowNull: false
                },
                salary: {
                    type: sequelize_1.DataTypes.UUID,
                    references: {
                        model: 'salary',
                        key: 'id'
                    }
                },
                account_number: {
                    type: sequelize_1.DataTypes.INTEGER,
                    allowNull: false
                },
                bankname: {
                    type: sequelize_1.DataTypes.TEXT,
                    allowNull: false
                },
                type: {
                    type: sequelize_1.DataTypes.TEXT,
                    defaultValue: 'nuban'
                },
                bank_code: {
                    type: sequelize_1.DataTypes.INTEGER,
                    allowNull: false
                },
                payment: {
                    type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.UUID)
                },
                profileimage: {
                    type: sequelize_1.DataTypes.TEXT
                },
                recipient: {
                    type: sequelize_1.DataTypes.TEXT
                }
            }, {
                sequelize,
                modelName: 'user',
                tableName: 'user',
            });
            User.beforeCreate((user) => __awaiter(this, void 0, void 0, function* () {
                const salt = yield bcryptjs_1.default.genSaltSync(10);
                user.password = yield bcryptjs_1.default.hashSync(user.password, salt);
            }));
        }
    }
}
exports.default = User;
