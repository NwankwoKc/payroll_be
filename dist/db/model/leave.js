"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class Leave extends sequelize_1.Model {
    static initialize(sequelize) {
        Leave.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            employee_id: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
            },
            leave_type_id: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
            },
            end_date: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            days_taken: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            status: {
                type: sequelize_1.DataTypes.ENUM("pending", "approved", "rejected"),
                allowNull: false,
            },
            reason: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false,
            },
            approved_by: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: true,
            },
            approved_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
            created_at: {
                type: sequelize_1.DataTypes.DATE,
                defaultValue: sequelize_1.DataTypes.NOW,
            },
            updated_at: {
                type: sequelize_1.DataTypes.DATE,
                defaultValue: sequelize_1.DataTypes.NOW,
            }
        }, {
            sequelize,
            tableName: 'leave',
            modelName: 'leave'
        });
    }
}
exports.default = Leave;
