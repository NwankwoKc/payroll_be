import { Payment } from "../db";
import HttpException from "../utils/http.exception";

export const processRecipientResult = async (event: any) => {
        try {
            const data = event.transfer;
            if (!data) {
                throw new HttpException(400, 'Invalid transfer data received');
            }

            const eventType = data.status;
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
                reference: data.reference.split('_')[0],
                amount: data.amount,
                meta: data.meta,
                fees_charged: data.fee || 0,
                currency: data.currency || 'NGN',
                completed_at: new Date().toISOString(),
                status
            };

            const existingPayment = await Payment.findOne({
                where: { reference: resultData.reference }
            });

            if (!existingPayment) {
                await Payment.create({
                    name: resultData.meta,
                    reference:resultData.reference,
                    data: resultData
                });
            } else {
                await existingPayment.update({
                    data: resultData
                });
            }

        } catch (error: any) {
            console.log('Payment processing error:', {
                error: error.message,
                stack: error.stack,
                data: event
            });
            throw new HttpException(500, `Failed to process payment: ${error.message}`);
        }
    }