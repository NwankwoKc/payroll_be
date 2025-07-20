"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const API_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
function verify(eventData, signature) {
    const hmac = crypto_1.default.createHmac('sha512', API_SECRET_KEY);
    const expectedSignature = hmac.update(JSON.stringify(eventData)).digest('hex');
    return expectedSignature === signature;
}
exports.default = verify;
