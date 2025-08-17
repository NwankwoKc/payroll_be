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
    metadata:{
      user_id:data.metadata.user_id
    },
    completed_at: data.transferred_at ? new Date(data.transferred_at) : new Date()
  };
  try{
    const d = await Payment.findOne({
        where:{
            name:data.id
        }
    })
    if(!d){
        const l = await Payment.create({
            name: data.id,
            data: resultData
        })
    }else{
    d.update({
        name:data.id,
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
    // this.processRecipientResult(eventData)
    // res.status(200).json({
    //   data:eventData
    // });
}
}