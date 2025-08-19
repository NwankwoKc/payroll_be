import { Router, Request, Response } from "express";
import verify from "../utils/verifyWebhook";
import Payment from "../db/model/payslip";
import HttpException from '../utils/http.exception';
import WebSocket from 'ws';
import {App} from '../index' // Import your App class

export class Webhook {
    router: Router;
    private app: App;

    constructor() {
        this.router = Router();
        this.app = App.getInstance(); // Get the App instance
        this.initRoutes();
    }

    public initRoutes() {
        this.router.post('/flw/webhook',this.webhook);
    }
    public processRecipientResult = async (event: any) => {
        try {
            const data = event.transfer;
            if (!data) {
                throw new HttpException(400, 'Invalid transfer data received');
            }

            const eventType = data.status;
            
            let status;
            switch (eventType) {
                case 'SUCCESSFUL':
                    status = 'success';
                    break;
                case 'FAILED':
                    status = 'failed';
                    break;
                default:
                    status = 'pending';
            }

            const resultData = {
                event_type: eventType,
                received_at: new Date().toISOString(),
                id: data.id,
                account_number: data.account_number,
                bank_name: data.bank_name,
                reference: data.reference,
                amount: data.amount,
                meta: data.meta,
                fees_charged: data.fee || 0,
                currency: data.currency || 'NGN',
                completed_at: new Date().toISOString(),
                status
            };

            const existingPayment = await Payment.findOne({
                where: { name: resultData.meta }
            });

            if (!existingPayment) {
                await Payment.create({
                    name: resultData.meta,
                    data: resultData
                });
            } else {
                await existingPayment.update({
                    name: resultData.meta,
                    data: resultData
                });
            }

        } catch (error: any) {
            console.log('Payment processing error:', {
                error: error.message,
                stack: error.stack,
                data: event
            });
            throw new HttpException(500, `Failed to process payment: ${error.message}`);
        }
    }

    public webhook = async (req: Request, res: Response) => {
        const eventData = req.body;
        const signature = req.headers["verif-hash"] as string;
        const hashver = process.env.flutterwave_skhash as string;

        // Broadcast to WebSocket clients
        if (this.app.ws) {
            this.app.ws.clients.forEach((client: WebSocket) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        type: 'webhook_event',
                        data: eventData,
                        timestamp: new Date().toISOString()
                    }));
                }
            });
        }

        if (!verify(hashver, signature)) {
            console.log("failed to verify hash");
            res.status(400).json({
                data: "failed to verify hash"
            });
        }

        console.log("verified hash");
        console.log(eventData);
        
        // Process the webhook asynchronously
        this.processRecipientResult(eventData).catch(error => {
            console.error('Error processing webhook:', error);
        });

        res.status(200).json({
            data: eventData,
            message: "Webhook processed successfully"
        });
    }
}