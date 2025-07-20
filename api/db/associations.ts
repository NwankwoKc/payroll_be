import { Sequelize } from 'sequelize';
import User from './model/user';
import Payment from './model/payslip';
import Department from './model/department';
import Attendance from './model/attendance';
import Position from './model/postion';
import { Salary } from './model/salary';
import leave from './model/leave';

export const setupAssociations = (sequelize: Sequelize) => {
  // User -> Payment (One-to-Many)
  User.hasMany(Payment, {
    foreignKey: 'employee_id',
    as: 'payments', // Renamed to avoid conflict with User's 'payment' array field
  });

  // Payment -> User (Many-to-One)
  Payment.belongsTo(User, {
    foreignKey: 'employee_id',
    as: 'employee',
  });

  // Department -> User (One-to-Many)
  Department.hasMany(User, {
    foreignKey: 'department',
    as: 'department_users',
  });

  // User -> Department (Many-to-One)
  User.belongsTo(Department, {
    foreignKey: 'department',
    as: 'employee_department',
  });

  //User -> Attendance (One-to-Many)
  User.hasMany(Attendance, {
    foreignKey: 'employee_id',
    as: 'attendances',
  })

  // Attendance -> User (Many-to-One)
  Attendance.belongsTo(User, {
    foreignKey: 'employee_id',
    as: 'employee_attendance',
  });
  
  //position -> user (One-to-Many)
  Position.hasMany(User, {
    foreignKey:'position',
    as:'position_user'
  })
  //user -> position (Many-to-One)
  User.belongsTo(Position, {
    foreignKey:'position',
    as:'user_position'
  })

  //salary -> user (One-to-Many)
  Salary.hasMany(User, {
    foreignKey:'salary',
    as:'salary_user'
  })
  //user -> salary (Many-to-One)
  User.belongsTo(Salary, {
    foreignKey:'salary',
    as:'user_salary'
  })

  // Hooks for managing Department's `employees` array
  User.afterCreate(async (user) => {
    if (user.department) {
      await Department.update(
        { employees: sequelize.fn('array_append', sequelize.col('employees'), user.id) },
        { where: { id: user.department } }
      );
    }
  });

  User.afterDestroy(async (user) => {
    if (user.department) {
      await Department.update(
        { employees: sequelize.fn('array_remove', sequelize.col('employees'), user.id) },
        { where: { id: user.department } }
      );
    }
  });
};