import { Router ,Request,Response} from "express";
import verify from "../utils/verifyWebhook";
import Payment, { paymentcreationattribute } from "../db/model/payslip";
import { UUID } from "sequelize";

export class Webhook {
    router: Router;
    constructor() {
    this.router = Router();
    this.initRoutes()
  }

public initRoutes (){
    this.router.post('/flw/webhook',this.webhook)
}
public processRecipientResult = async (event:any)=>{
    const data = event.data;
    const transferCode = data.transfer_code;
    const eventType = data.status;
    console.log(`Processing ${eventType} for recipient: ${data.recipient?.name || 'Unknown'}`);

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
    received_at: new Date(),
    id:data.id,
    account_number:data.account_number,
    bank_name:data.bank_name,
    bank_code:data.bank_code,
    reference:data.reference,
    amount:data.amount,
    fees_charged: data.fee || 0,
    currency: data.currency || 'NGN',
    completed_at: data.transferred_at ? new Date(data.transferred_at) : new Date()
  };
  try{
    let dt = data.reference
     // Remove "Monthly salary for " prefix and any names
    const idPart = dt.split('Monthly salary for ')[1];
    // Get everything after the first uppercase letter (end of firstname)
    let result = idPart.match(/[A-Z].*/)?.[0] || '';
    const d = await Payment.findOne({
        where:{
            name:result
        }
    })
    if(!d){
        const l = await Payment.create({
            name: result,
            data: resultData
        })
    }else{
    d.update({
        name:result,
        data:resultData
    })
    }
  }catch{
    console.error('error')
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
    let dt = eventData.reference
     // Remove "Monthly salary for " prefix and any names
    const idPart = dt.split('Monthly salary for ')[1];
    // Get everything after the first uppercase letter (end of firstname)
    let result = idPart.match(/[A-Z].*/)?.[0] || '';
    console.log(result)
    console.log(typeof result)
    // this.processRecipientResult(eventData)
    // res.status(200).json({
    //   data:eventData
    // });
}
}