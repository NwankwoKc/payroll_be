import { AuthController } from "./controllers/auth/auth.controller";
import { App } from "./index";
import dotenv from 'dotenv'
import {user} from './controllers/user.controller'
import { department } from "./controllers/department.controller";
import { Payslip } from "./controllers/payslip.controller";
import { attendance } from "./controllers/attendance.controller";
import {position} from "./controllers/position.controller";
import {salary} from "./controllers/salary.controller";
import bulkpayment from "./controllers/paystack.controller";
dotenv.config()
const app = new App ([new AuthController(),new user(),new department(),new Payslip(),new attendance(),new position(),new salary(),new bulkpayment()],process.env.PORT as unknown as number || 3000)
app.listen()
export default app;
