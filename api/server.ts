import { AuthController } from "./controllers/auth/auth.controller";
import { App } from "./index";
import dotenv from 'dotenv'
import {user} from './controllers/user.controller'
import { department } from "./controllers/department.controller";
import { Payslip } from "./controllers/payslip.controller";
import { attendance } from "./controllers/attendance.controller";
import {position} from "./controllers/position.controller";
import {salary} from "./controllers/salary.controller";
import { Webhook } from "./controllers/webhook.controller";
import bulkpayment from "./controllers/flutterwave.controller";

dotenv.config()

async function initializeApp() {
    // Step 1: Create controllers that don't depend on App instance
    const regularControllers = [
        new AuthController(),
        new user(),
        new department(),
        new Payslip(),
        new attendance(),
        new position(),
        new salary(),
        new bulkpayment()
    ];

    // Step 2: Create App with regular controllers only
    const app = new App(regularControllers, process.env.PORT as unknown as number || 3000);
    
    // Step 3: Start the server and initialize WebSocket
    app.listen();
    
    // Step 4: Wait a moment for WebSocket to be ready
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Step 5: Now create the Webhook controller (App.getInstance() will work)
    const webhookController = new Webhook();
    
    // Step 6: Add the webhook routes manually
    app.express.use("/api", webhookController.router);
    
    console.log('All controllers initialized successfully');
    
    return app;
}

// Initialize the app
const appPromise = initializeApp();

export default appPromise;