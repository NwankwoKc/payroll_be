import crypto from "crypto" 

const API_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY as string;

function verify(eventData: any, signature: string): boolean {
    const hmac = crypto.createHmac('sha512', API_SECRET_KEY);
    const expectedSignature = hmac.update(JSON.stringify(eventData)).digest('hex');
    return expectedSignature === signature;
}
export default verify