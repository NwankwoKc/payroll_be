"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Salary = void 0;
const sequelize_1 = require("sequelize");
class Salary extends sequelize_1.Model {
    static initialize(sequelize) {
        Salary.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            amount: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            calculation_type: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            is_active: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false
            },
            is_taxable: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false
            },
            taxDeduction: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            }
        }, {
            sequelize,
            modelName: 'salary',
            tableName: 'salary', // Sequelize automatically pluralizes
            timestamps: true, // Enable if you want createdAt/updatedAt
            underscored: true // Optional: if you prefer snake_case naming
        });
    }
}
exports.Salary = Salary;
