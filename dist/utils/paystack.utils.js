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
exports.InitializeBulkTransfer = exports.PaystackCreateBulkTransferRecipient = void 0;
const axios_1 = __importDefault(require("axios"));
const http_exception_1 = __importDefault(require("./http.exception"));
class PaystackCreateBulkTransferRecipient {
    constructor() { }
    createBulkTransferRecipient(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const options = {
                method: 'POST',
                url: 'https://api.paystack.co/transferrecipient',
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                },
                data
            };
            try {
                const response = yield axios_1.default.request(options);
                return response.data;
            }
            catch (error) {
                console.log((_a = error.response) === null || _a === void 0 ? void 0 : _a.data);
                return new http_exception_1.default(500, ((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || 'Unable to create bulk transfer recipient');
            }
        });
    }
}
exports.PaystackCreateBulkTransferRecipient = PaystackCreateBulkTransferRecipient;
class InitializeBulkTransfer {
    constructor() { }
    initializebulktransfer(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                url: 'https://api.paystack.co/transfer/bulk',
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                },
                data
            };
            try {
                console.log(options);
                const response = yield axios_1.default.request(options);
                console.log(response);
                return response;
            }
            catch (_a) {
                return new http_exception_1.default(500, 'unable to initialize bulk transfer');
            }
        });
    }
}
exports.InitializeBulkTransfer = InitializeBulkTransfer;
