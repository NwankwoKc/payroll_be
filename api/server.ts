import { AuthController } from "../src/controllers/auth/auth.controller";
import { App } from "../src/index";
import dotenv from 'dotenv'
import {user} from '../src/controllers/user.controller'
import { department } from "../src/controllers/department.controller";
import { Payslip } from "../src/controllers/payslip.controller";
import { attendance } from "../src/controllers/attendance.controller";
import {position} from "../src/controllers/position.controller";
import {salary} from "../src/controllers/salary.controller";
import bulkpayment from "../src/controllers/paystack.controller";
dotenv.config()
const app = new App ([new AuthController(),new user(),new department(),new Payslip(),new attendance(),new position(),new salary(),new user(),new bulkpayment()],process.env.PORT as unknown as number || 3000).express
export default app;
