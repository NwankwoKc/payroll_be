"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
;
class Payment extends sequelize_1.Model {
    static initialize(sequelize) {
        Payment.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: sequelize_1.DataTypes.UUID,
                references: {
                    model: 'user',
                    key: 'id'
                }
            },
            data: {
                type: sequelize_1.DataTypes.JSON
            }
        }, {
            sequelize,
            tableName: 'payslip',
            modelName: 'payslip',
        });
    }
}
exports.default = Payment;
