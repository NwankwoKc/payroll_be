const { Sequelize } = require('sequelize');
import User from './model/user'
import Payment from './model/payslip'
import Department from './model/department'
import Position from './model/postion';
import {setupAssociations} from './associations';
import { Salary } from './model/salary';
import Attendance from './model/attendance';
import leave from './model/leave';
import dotenv from 'dotenv';
dotenv.config()
const sequelize  = new Sequelize(process.env.databaseurl as string || "postgresql://postgres.jtdjpjsmhglhmybdaida:plmoknijb101@aws-0-eu-west-2.pooler.supabase.com:6543/postgres")
User.initialize(sequelize);
Payment.initialize(sequelize);
Department.initialize(sequelize);
Position.initialize(sequelize);
Salary.initialize(sequelize);
Attendance.initialize(sequelize);
leave.initialize(sequelize);
// Set up associations
setupAssociations(sequelize);

// Sync database
(async () => {
  try {
    await sequelize.sync({
      force:false
    });
    console.log('Database synced!');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
})();

export { sequelize, User, Payment, Department };
export default sequelize

