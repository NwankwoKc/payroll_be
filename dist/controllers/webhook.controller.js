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
            var _a, _b;
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
                fees_charged: data.fee || 0,
                currency: data.currency || 'NGN',
                completed_at: data.transferred_at ? new Date(data.transferred_at) : new Date()
            };
            try {
                let dt = data.reference;
                // Remove "Monthly salary for " prefix and any names
                const idPart = dt.split('Monthly salary for ')[1];
                // Get everything after the first uppercase letter (end of firstname)
                let result = ((_b = idPart.match(/[A-Z].*/)) === null || _b === void 0 ? void 0 : _b[0]) || '';
                const d = yield payslip_1.default.findOne({
                    where: {
                        name: result
                    }
                });
                if (!d) {
                    const l = yield payslip_1.default.create({
                        name: result,
                        data: resultData
                    });
                }
                else {
                    d.update({
                        name: result,
                        data: resultData
                    });
                }
            }
            catch (_c) {
                console.error('error');
            }
        });
        this.webhook = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
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
            let dt = eventData.reference;
            // Remove "Monthly salary for " prefix and any names
            const idPart = dt.split('Monthly salary for ')[1];
            // Get everything after the first uppercase letter (end of firstname)
            let result = ((_a = idPart.match(/[A-Z].*/)) === null || _a === void 0 ? void 0 : _a[0]) || '';
            console.log(result);
            console.log(typeof result);
            // this.processRecipientResult(eventData)
            // res.status(200).json({
            //   data:eventData
            // });
        });
        this.router = (0, express_1.Router)();
        this.initRoutes();
    }
    initRoutes() {
        this.router.post('/flw/webhook', this.webhook);
    }
}
exports.Webhook = Webhook;
