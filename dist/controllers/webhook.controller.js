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
const express_1 = require("express");
const verifyWebhook_1 = __importDefault(require("../utils/verifyWebhook"));
const payslip_1 = __importDefault(require("../db/model/payslip"));
class Webhook {
    constructor() {
        this.processRecipientResult = (event) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            const data = event.data;
            const transferCode = data.transfer_code;
            const eventType = event.event;
            console.log(`Processing ${eventType} for recipient: ${((_a = data.recipient) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown'}`);
            // Determine status from event type
            let status;
            switch (eventType) {
                case 'transfer.success':
                    status = 'success';
                    break;
                case 'transfer.failed':
                    status = 'failed';
                    break;
                case 'transfer.reversed':
                    status = 'reversed';
                    break;
                default:
                    status = 'pending';
            }
            const resultData = {
                event_type: eventType,
                received_at: new Date(),
                gateway_response: data.gateway_response || null,
                failure_reason: data.failures ? data.failures.join(', ') : null,
                receipt_number: data.receipt_number || null,
                session_id: ((_b = data.session) === null || _b === void 0 ? void 0 : _b.id) || null,
                fees_charged: data.fees || 0,
                currency: data.currency || 'NGN',
                bank_reference: data.titan_code || null,
                completed_at: data.transferred_at ? new Date(data.transferred_at) : new Date()
            };
            try {
                const d = yield payslip_1.default.findOne({
                    where: {
                        name: (_c = data.recipient) === null || _c === void 0 ? void 0 : _c.name
                    }
                });
                if (!d) {
                    const l = yield payslip_1.default.create({
                        name: (_d = data.recipient) === null || _d === void 0 ? void 0 : _d.name,
                        recieptnum: data.receipt_number,
                        data: resultData
                    });
                }
                else {
                    d.update({
                        name: (_e = data.recipient) === null || _e === void 0 ? void 0 : _e.name,
                        recieptnum: data.receipt_number,
                        data: resultData
                    });
                }
            }
            catch (_f) {
                console.error('error');
            }
        });
        this.webhook = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const eventData = req.body;
            const signature = req.headers['x-paystack-signature'];
            if (!(0, verifyWebhook_1.default)(eventData, signature)) {
                res.sendStatus(400);
            }
            const event = JSON.parse(eventData.toString());
            if (event.event.startsWith('transfer.')) {
                yield this.processRecipientResult(event);
            }
            console.log(eventData);
            res.sendStatus(200);
        });
        this.router = (0, express_1.Router)();
        this.initRoutes();
    }
    initRoutes() {
        this.router.post('/paystack/webhook', this.webhook);
    }
}
