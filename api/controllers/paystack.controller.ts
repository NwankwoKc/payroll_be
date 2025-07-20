import User from '../db/model/user'
import { Salary } from '../db/model/salary'
import { PaystackCreateBulkTransferRecipient} from '../utils/paystack.utils';
import {v4 as uuidv4} from 'uuid'
import { SalaryAttributes } from '../db/model/salary';
import HttpException from '../utils/http.exception';
import { Router,Request,Response } from 'express';
import asyncWrap from '../utils/asyncWrapper';
import axios from 'axios';


interface TransferSuccessEvent {
  data: {
    amount: number;
    currency: string; // e.g., "NGN"
    domain: string;
    failures: null | any; // Replace `any` with a more specific type if needed
    id: number;
    integration: {
      id: number;
      is_live: boolean;
      business_name: string;
    };
    reason: string;
    reference: string;
    source: string; // e.g., "balance"
    source_details: null | any;
    status: "success";
    titan_code: null | string;
    transfer_code: string;
    transferred_at: null | string; // ISO date string
    recipient: {
      active: boolean;
      currency: string;
      description: string;
      domain: string;
      email: null | string;
      id: number;
      integration: number;
      metadata: null | any;
      name: string;
      recipient_code: string;
      type: string; // e.g., "nuban"
      is_deleted: boolean;
      details: {
        account_number: string;
        account_name: null | string;
        bank_code: string;
        bank_name: string;
      };
      created_at: string; // ISO date string
      updated_at: string; // ISO date string
    };
    session: {
      provider: null | string;
      id: null | string;
    };
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
  };
}
type bulkdatatype = {
    amount:number;
    reference:string;
    reason:string;
    recipient:string
}

type transfer = {
    currency:string;
    source:string,
    transfers:bulkdatatype[]
}

interface UserWithSalary extends User {
    user_salary: SalaryAttributes;
}

class bulkpayment{
    router:Router;
    constructor(){
        this.router = Router();
        this.initRoutes();
    }

    public initRoutes(){
        this.router.post('/bulkpayment', this.bulkpayments)
    }

    private bulkpayments = async (req: Request, res: Response) => {
        try{
            const users = await User.findAll({
                include: [{
                    model: Salary,
                    as: 'user_salary'
                }]
            });
            const transferRequest: transfer = {
                currency: "NGN",
                source: "balance",
                transfers: users.map((user: any) => ({
                    amount: user.user_salary.amount,
                    reference: uuidv4(),
                    reason: `Monthly salary for ${user.firstname}`,
                    recipient: user.recipienterror
                }))
            };
            const options = {
                url: 'https://api.paystack.co/transfer/bulk',
                method: 'POST',
                headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json'
                },
                data:JSON.stringify(transferRequest)
            }
                const response = await axios.request(options)
            res.status(200).json({
                data: response.data
            });
        }
        catch(error:any){
            console.error(error);
            res.status(500).json({
                message: 'Unable to process bulk payment',
                error: error.message
            });
        }
       
    }
    
}

export default bulkpayment;