"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Webhook = void 0;
const express_1 = require("express");
const verifyWebhook_1 = __importDefault(require("../utils/verifyWebhook"));
const payslip_1 = __importDefault(require("../db/model/payslip"));
const http_exception_1 = __importDefault(require("../utils/http.exception"));
const index_1 = require("../index"); // Import your App class
class Webhook {
    constructor() {
        this.processRecipientResult = (event) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = event.transfer;
                if (!data) {
                    throw new http_exception_1.default(400, 'Invalid transfer data received');
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
                    reference: data.reference,
                    amount: data.amount,
                    meta: data.meta,
                    fees_charged: data.fee || 0,
                    currency: data.currency || 'NGN',
                    completed_at: new Date().toISOString(),
                    status
                };
                const existingPayment = yield payslip_1.default.findOne({
                    where: { name: resultData.meta }
                });
                if (!existingPayment) {
                    yield payslip_1.default.create({
                        name: resultData.meta,
                        data: resultData
                    });
                }
                else {
                    yield existingPayment.update({
                        name: resultData.meta,
                        data: resultData
                    });
                }
            }
            catch (error) {
                console.log('Payment processing error:', {
                    error: error.message,
                    stack: error.stack,
                    data: event
                });
                throw new http_exception_1.default(500, `Failed to process payment: ${error.message}`);
            }
        });
        this.webhook = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const eventData = req.body;
            const signature = req.headers["verif-hash"];
            const hashver = process.env.flutterwave_skhash;
            this.app.pushtowebsocket(eventData);
            if (!(0, verifyWebhook_1.default)(hashver, signature)) {
                console.log("failed to verify hash");
                res.status(400).json({
                    data: "failed to verify hash"
                });
            }
            console.log("verified hash");
            console.log(eventData);
            // Process the webhook asynchronously
            this.processRecipientResult(eventData).catch(error => {
                console.error('Error processing webhook:', error);
            });
            res.status(200).json({
                data: eventData,
                message: "Webhook processed successfully"
            });
        });
        this.router = (0, express_1.Router)();
        this.app = index_1.App.getInstance(); // Get the App instance
        this.initRoutes();
    }
    initRoutes() {
        this.router.post('/flw/webhook', this.webhook);
    }
}
exports.Webhook = Webhook;
