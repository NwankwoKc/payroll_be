"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controller_1 = require("./controllers/auth/auth.controller");
const index_1 = require("./index");
const dotenv_1 = __importDefault(require("dotenv"));
const user_controller_1 = require("./controllers/user.controller");
const department_controller_1 = require("./controllers/department.controller");
const payslip_controller_1 = require("./controllers/payslip.controller");
const attendance_controller_1 = require("./controllers/attendance.controller");
const position_controller_1 = require("./controllers/position.controller");
const salary_controller_1 = require("./controllers/salary.controller");
const webhook_controller_1 = require("./controllers/webhook.controller");
const flutterwave_controller_1 = __importDefault(require("./controllers/flutterwave.controller"));
dotenv_1.default.config();
function initializeApp() {
    return __awaiter(this, void 0, void 0, function* () {
        // Step 1: Create controllers that don't depend on App instance
        const regularControllers = [
            new auth_controller_1.AuthController(),
            new user_controller_1.user(),
            new department_controller_1.department(),
            new payslip_controller_1.Payslip(),
            new attendance_controller_1.attendance(),
            new position_controller_1.position(),
            new salary_controller_1.salary(),
            new flutterwave_controller_1.default()
        ];
        // Step 2: Create App with regular controllers only
        const app = new index_1.App(regularControllers, process.env.PORT || 3000);
        // Step 3: Start the server and initialize WebSocket
        app.listen();
        // Step 4: Wait a moment for WebSocket to be ready
        yield new Promise(resolve => setTimeout(resolve, 100));
        // Step 5: Now create the Webhook controller (App.getInstance() will work)
        const webhookController = new webhook_controller_1.Webhook();
        // Step 6: Add the webhook routes manually
        app.express.use("/api", webhookController.router);
        console.log('All controllers initialized successfully');
        return app;
    });
}
// Initialize the app
const appPromise = initializeApp();
exports.default = appPromise;
