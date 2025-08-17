import { Router ,Request,Response} from "express";
import verify from "../utils/verifyWebhook";
import Payment, { paymentcreationattribute } from "../db/model/payslip";
import { UUID } from "sequelize";
import { error } from "console";
import HttpException from '../utils/http.exception';

export class Webhook {
    router: Router;
    constructor() {
    this.router = Router();
    this.initRoutes()
  }

public initRoutes (){
    this.router.post('/flw/webhook',this.webhook)
}
public processRecipientResult = async (event: any) => {
    try {
        const data = event.transfer;
        if (!data) {
            throw new HttpException(400, 'Invalid transfer data received');
        }

        const eventType = data.status;
        

        // Determine status from event type
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
            where: {
                name: resultData.meta
            }
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
        throw new HttpException(
            500,
            `Failed to process payment: ${error.message}`
        );
    }
}

public webhook = async(req:Request,res:Response)=>{
    const eventData = req.body;
    const signature = req.headers["verif-hash"] as string;
    const hashver = process.env.flutterwave_skhash as string

    if(!verify(hashver,signature)){
      console.log("failed to verify hash")
      res.status(400).json({
      data:"faliled to verify hash"
    })}
    console.log("verified hash")
    console.log(eventData);
    this.processRecipientResult(eventData)
    res.status(200).json({
      data:eventData
    });
}
}