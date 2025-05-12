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
const paystack_utils_1 = require("../utils/paystack.utils");
const uuid_1 = require("uuid");
const express_1 = require("express");
const asyncWrapper_1 = __importDefault(require("../utils/asyncWrapper"));
class bulkpayment {
    constructor() {
        this.bulkpayments = (0, asyncWrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
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
                    recipient: user.recipient
                }))
            };
            console.log(transferRequest);
            const blk = new paystack_utils_1.InitializeBulkTransfer();
            const blkresult = yield blk.initializebulktransfer(transferRequest);
            res.status(200).json({
                data: blkresult
            });
        }));
        this.router = (0, express_1.Router)();
        this.initRoutes();
    }
    initRoutes() {
        this.router.post('/bulkpayment', this.bulkpayments);
    }
}
exports.default = bulkpayment;
