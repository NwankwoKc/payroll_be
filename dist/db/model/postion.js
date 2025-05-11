"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class Position extends sequelize_1.Model {
    static initialize(sequelize) {
        Position.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: sequelize_1.DataTypes.TEXT
            },
            department_id: {
                type: sequelize_1.DataTypes.UUID
            },
            paygrade_id: {
                type: sequelize_1.DataTypes.INTEGER
            },
            isactive: {
                type: sequelize_1.DataTypes.BOOLEAN
            },
            createdat: {
                type: sequelize_1.DataTypes.DATE
            },
            updatedat: {
                type: sequelize_1.DataTypes.DATE
            }
        }, {
            sequelize,
            tableName: 'position',
            modelName: 'position',
        });
    }
}
exports.default = Position;
