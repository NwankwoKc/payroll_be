// import axios from "axios";
// import HttpException from "./http.exception";
// import { error } from "console";

// type recipienttype = { 
//     name:string,
//     bank_code:string,
//     account_number:string,
//     currency:string,
//     type:string
// }

// interface PaystackResponse {
//     status: boolean;
//     message: string;
//     data?: any;
// }
// type bulkdatatype = {
//     amount:number;
//     reference:string;
//     reason:string;
//     recipient:string
// }
// type transfer = {
//     currency:string;
//     source:string,
//     transfers:bulkdatatype[]
// }

// class PaystackCreateBulkTransferRecipient {
//     constructor(){}

//     async createBulkTransferRecipient(data:recipienttype){
//         const options = {
//             method: 'POST',
//             url: 'https://api.paystack.co/transferrecipient',
//             headers: {
//                 Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//                 'Content-Type': 'application/json'
//             },
//             data
//         };
//         try {
//             const response = await axios.request(options);
//             return response.data;
//         } catch (error: any) {
//             console.log(error.response?.data)
//             return new HttpException(500,error.response?.data?.message || 'Unable to create bulk transfer recipient')
//         }
//     }
// }



// export {PaystackCreateBulkTransferRecipient}