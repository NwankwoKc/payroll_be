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
class Webhook {
    constructor() {
        this.processRecipientResult = (event) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const data = event.data;
            const transferCode = data.transfer_code;
            const eventType = data.status;
            console.log(`Processing ${eventType} for recipient: ${((_a = data.recipient) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown'}`);
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
                id: data.id,
                account_number: data.account_number,
                bank_name: data.bank_name,
                bank_code: data.bank_code,
                reference: data.reference,
                amount: data.amount,
                fees_charged: data.fees || 0,
                currency: data.currency || 'NGN',
                completed_at: data.transferred_at ? new Date(data.transferred_at) : new Date()
            };
            try {
                const d = yield payslip_1.default.findOne({
                    where: {
                        name: data.id
                    }
                });
                if (!d) {
                    const l = yield payslip_1.default.create({
                        name: data.id,
                        data: resultData
                    });
                }
                else {
                    d.update({
                        name: data.id,
                        data: resultData
                    });
                }
            }
            catch (_b) {
                console.error('error');
            }
        });
        this.webhook = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const eventData = req.body;
            const signature = req.headers["verif-hash"];
            const hashver = process.env.flutterwave_skhash;
            if (!(0, verifyWebhook_1.default)(hashver, signature)) {
                console.log("failed to verify hash");
                res.status(400).json({
                    data: "faliled to verify hash"
                });
            }
            console.log("verified hash");
            console.log(eventData);
            console.log(typeof eventData);
            res.sendStatus(200);
        });
        this.router = (0, express_1.Router)();
        this.initRoutes();
    }
    initRoutes() {
        this.router.post('/flw/webhook', this.webhook);
    }
}
exports.Webhook = Webhook;
