import User from '../db/model/user'
import { Salary } from '../db/model/salary'
import { PaystackCreateBulkTransferRecipient, InitializeBulkTransfer} from '../utils/paystack.utils';
import {v4 as uuidv4} from 'uuid'
import { SalaryAttributes } from '../db/model/salary';
import HttpException from '../utils/http.exception';
import { Router,Request,Response } from 'express';
import asyncWrap from '../utils/asyncWrapper';

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

    private bulkpayments = asyncWrap(async (req: Request, res: Response) => {
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
                recipient: user.recipient
            }))
        };
        console.log(transferRequest);
        const blk = new InitializeBulkTransfer();
        const blkresult = await blk.initializebulktransfer(transferRequest);
        res.status(200).json({
            data: blkresult
        });
    })
    
}

export default bulkpayment;