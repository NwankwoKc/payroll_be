import { Router ,Request,Response} from "express";
class Webhook {
    router: Router;

    constructor() {
    this.router = Router();
    this.initRoutes()
}

public initRoutes (){
    this.router.post('/paystack/webhook',this.webhook)
}


public webhook = async(req:Request,res:Response)=>{
    const eventData = req.body;
    console.log(eventData);
    res.sendStatus(200);
}
}