"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class Department extends sequelize_1.Model {
    static initialize(sequelize) {
        Department.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: sequelize_1.DataTypes.TEXT
            },
            location: {
                type: sequelize_1.DataTypes.TEXT
            },
            employees: {
                type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.UUID)
            }
        }, {
            sequelize,
            tableName: 'department',
            modelName: 'department',
        });
    }
}
exports.default = Department;
