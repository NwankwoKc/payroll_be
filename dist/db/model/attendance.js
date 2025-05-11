"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class Attendance extends sequelize_1.Model {
    static initialize(sequelize) {
        Attendance.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                primaryKey: true,
                allowNull: false,
            },
            employee_id: {
                type: sequelize_1.DataTypes.UUID
            },
            created_at: {
                type: sequelize_1.DataTypes.DATE
            },
            status: {
                type: sequelize_1.DataTypes.ENUM("late", "punctual")
            },
            leave_id: {
                type: sequelize_1.DataTypes.UUID
            }
        }, {
            sequelize,
            tableName: 'attendance',
            modelName: 'attendance'
        });
    }
}
exports.default = Attendance;
