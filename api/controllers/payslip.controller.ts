import { Request, Response, Router } from "express";
import asyncWrap from "../utils/asyncWrapper";
import HttpException from "../utils/http.exception";
import { Op } from "sequelize";
import { departmentcreationattribute } from "../db/model/department";
import { v4 as uuidv4 } from "uuid";
import Payment, { paymentcreationattribute } from "../db/model/payslip";
import errorMiddleware from "../middlewares/error.middleware";
import  User  from "../db/model/user";


export class Payslip {
  router: Router;

  constructor() {
    this.router = Router();
    this.initRoutes();
  }

  initRoutes() {;
    this.router.get("/payments", this.getpayslip);
    this.router.post("/payments/:bulk_reference", this.createpayslip);
    this.router.get("/payments/:id", this.getspecificpayslip);
    this.router.put("/payments/:id", this.updatepayslip);
    this.router.delete("/payments/:id", this.deletepayslip);
  }

  private getpayslip = asyncWrap(async (req: Request, res: Response) => {
    const check = await Payment.findAll();
    if (!check) {
      throw new HttpException(404, "No departments found");
    }
    res.status(200).json({
      success: true,
      data: check,
    });
  })
  private createpayslip = asyncWrap(async (req: Request, res: Response) => {
    const payment:paymentcreationattribute = req.body;
    const bulkreference = req.params.bulk_reference;
    
  });
  private getspecificpayslip = asyncWrap(async (req: Request, res: Response) => {
    const check = await Payment.findByPk(req.params.id)
    if (!check) {
      throw new HttpException(404, "No departments found");
    }
    res.status(200).json({
      success: true,
      data: check,
    });
    
  });
  private updatepayslip = asyncWrap(async (req: Request, res: Response) => {
      const body:departmentcreationattribute = req.body
      const check = await Payment.update(body,{
        where:{
          id:req.params.id
        }
      })
      if (!check) {
        throw new HttpException(404, "No departments found");
      }
      res.status(200).json({
        success: true,
        data: check,
      });
  });
  private deletepayslip = asyncWrap(async (req: Request, res: Response) => {
      const check = await Payment.destroy({
        where:{
          id:req.params.id
        }
      })
      res.status(200).json({
        success:true
      })
  });
}