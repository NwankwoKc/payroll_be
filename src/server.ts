import { AuthController } from "./controllers/auth/auth.controller";
import { App } from "./index";
import dotenv from 'dotenv'
import {user} from './controllers/user.controller'
dotenv.config()
const app = new App ([new AuthController(),new user()],3000)
app.listen()