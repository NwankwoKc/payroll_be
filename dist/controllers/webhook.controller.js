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
const console_1 = require("console");
class Webhook {
    constructor() {
        this.processRecipientResult = (event) => __awaiter(this, void 0, void 0, function* () {
            const data = event.transfer;
            const eventType = data.status;
            console.log(data);
            console.log(typeof data.meta);
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
                reference: data.reference,
                amount: data.amount,
                meta: data.meta,
                fees_charged: data.fee || 0,
                currency: data.currency || 'NGN',
                completed_at: new Date()
            };
            try {
                const d = yield payslip_1.default.findOne({
                    where: {
                        name: resultData.meta
                    }
                });
                if (!d) {
                    const l = yield payslip_1.default.create({
                        name: resultData.meta,
                        data: resultData
                    });
                }
                else {
                    d.update({
                        name: resultData.meta,
                        data: resultData
                    });
                }
            }
            catch (_a) {
                console.error('error', console_1.error);
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
            this.processRecipientResult(eventData);
            res.status(200).json({
                data: eventData
            });
        });
        this.router = (0, express_1.Router)();
        this.initRoutes();
    }
    initRoutes() {
        this.router.post('/flw/webhook', this.webhook);
    }
}
exports.Webhook = Webhook;
