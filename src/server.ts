import { AuthController } from "./controllers/auth/auth.controller";
import { App } from "./index";
import dotenv from 'dotenv'
import {user} from './controllers/user.controller'
import { department } from "./controllers/department.controller";
import { Payslip } from "./controllers/payslip.controller";
import { attendance } from "./controllers/attendance.controller";
dotenv.config()
const app = new App ([new AuthController(),new user(),new department(),new Payslip(),new attendance()],3000)
app.listen()