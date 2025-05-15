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
const user_1 = __importDefault(require("../db/model/user"));
const salary_1 = require("../db/model/salary");
const uuid_1 = require("uuid");
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
class bulkpayment {
    constructor() {
        this.bulkpayments = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield user_1.default.findAll({
                    include: [{
                            model: salary_1.Salary,
                            as: 'user_salary'
                        }]
                });
                const transferRequest = {
                    currency: "NGN",
                    source: "balance",
                    transfers: users.map((user) => ({
                        amount: user.user_salary.amount,
                        reference: (0, uuid_1.v4)(),
                        reason: `Monthly salary for ${user.firstname}`,
                        recipient: user.recipienterror
                    }))
                };
                const options = {
                    url: 'https://api.paystack.co/transfer/bulk',
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(transferRequest)
                };
                const response = yield axios_1.default.request(options);
                res.status(200).json({
                    data: response.data
                });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({
                    message: 'Unable to process bulk payment',
                    error: error.message
                });
            }
        });
        this.router = (0, express_1.Router)();
        this.initRoutes();
    }
    initRoutes() {
        this.router.post('/bulkpayment', this.bulkpayments);
    }
}
exports.default = bulkpayment;
