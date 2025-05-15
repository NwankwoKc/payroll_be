import User from '../db/model/user'
import { Salary } from '../db/model/salary'
import { PaystackCreateBulkTransferRecipient} from '../utils/paystack.utils';
import {v4 as uuidv4} from 'uuid'
import { SalaryAttributes } from '../db/model/salary';
import HttpException from '../utils/http.exception';
import { Router,Request,Response } from 'express';
import asyncWrap from '../utils/asyncWrapper';
import axios from 'axios';

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