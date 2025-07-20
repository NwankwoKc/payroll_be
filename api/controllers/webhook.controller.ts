import { Router ,Request,Response} from "express";
import verify from "../utils/verifyWebhook";
import Payment, { paymentcreationattribute } from "../db/model/payslip";
import { UUID } from "sequelize";

class Webhook {
    router: Router;

    constructor() {
    this.router = Router();
    this.initRoutes()
}

public initRoutes (){
    this.router.post('/paystack/webhook',this.webhook)
}
public processRecipientResult = async (event:any)=>{
    const data = event.data;
    const transferCode = data.transfer_code;
    const eventType = event.event;
    console.log(`Processing ${eventType} for recipient: ${data.recipient?.name || 'Unknown'}`);

  // Determine status from event type
  let status;
  switch (eventType) {
    case 'transfer.success':
      status = 'success';
      break;
    case 'transfer.failed':
      status = 'failed';
      break;
    case 'transfer.reversed':
      status = 'reversed';
      break;
    default:
      status = 'pending';
  }
  const resultData = {
    event_type: eventType,
    received_at: new Date(),
    gateway_response: data.gateway_response || null,
    failure_reason: data.failures ? data.failures.join(', ') : null,
    receipt_number: data.receipt_number || null,
    session_id: data.session?.id || null,
    fees_charged: data.fees || 0,
    currency: data.currency || 'NGN',
    bank_reference: data.titan_code || null,
    completed_at: data.transferred_at ? new Date(data.transferred_at) : new Date()
  };
  try{
    const d = await Payment.findOne({
        where:{
            name:data.recipient?.name
        }
    })
    if(!d){
        const l = await Payment.create({
            name: data.recipient?.name,
            recieptnum: data.receipt_number,
            data: resultData
        })
    }else{
    d.update({
        name:data.recipient?.name,
        recieptnum:data.receipt_number,
        data:resultData
    })
    }
  }catch{
    console.error('error')
  }
}

public webhook = async(req:Request,res:Response)=>{
    const eventData = req.body;
    const signature = req.headers['x-paystack-signature'] as string;

    if(!verify(eventData,signature)){res.sendStatus(400);}

    const event = JSON.parse(eventData.toString());
     if (event.event.startsWith('transfer.')) {
      await this.processRecipientResult(event);
    }
    console.log(eventData);
    res.sendStatus(200);
}
}