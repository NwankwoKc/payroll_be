import { NextFunction, Request, Response, Router } from "express";
import asyncWrap from "../utils/asyncWrapper";
import HttpException from "../utils/http.exception";
import { Op, Sequelize } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import  User  from "../db/model/user";
import { Salary, SalaryAttributes, SalaryCreationAttributes } from "../db/model/salary";
import Attendance from "../db/model/attendance";

declare module "express-serve-static-core" {
  interface Request {
    data?: any;
  }
}

export class salary {
  router: Router;

  constructor() {
    this.router = Router();
    this.initRoutes();
  }

  initRoutes() {;
    this.router.get("/salary", this.getsalary);
    this.router.post("/salary/:id", this.createsalary);
    this.router.get("/salary/:id", this.getspecificsalary);
    this.router.get("/salary/employee/:id", this.getspecificsalaryemployee);
    this.router.put("/salary/:id", this.updatesalary);
    this.router.delete("/salary/:id", this.deletesalary);
    this.router.post("/salaryamount/:id",this.calculatesalary,this.calculatesalarytwo)
  }

  private getsalary = asyncWrap(async (req: Request, res: Response) => {
    const salary = await Salary.findAll();
    if (!salary) {
      throw new HttpException(404, "No positions found");
    }
    res.status(200).json({
      success: true,
      data: salary,
    });
  })
  private createsalary = async (req: Request, res: Response) => {
    try {
      const salary:SalaryCreationAttributes = req.body;
      const check = await Salary.findAll({
          where:{
              name:salary.name
          }
      })

    if(check.length > 0){
       throw new HttpException(400,'salary name already exits')
    }

    const sala:SalaryAttributes = await Salary.create(req.body)

    //update the user table with the salary id
    const user = await User.update({
      salary:sala.id
    },{
      where:{
        id:req.params.id
    }})

    res.status(200).json({
      success:true
    })
    }catch (error) {
      if (error instanceof HttpException) {
        res.status(error.status).json({
          success: false,
          message: error.message,
        });
      }
    }
  };
  private getspecificsalary = asyncWrap(async (req: Request, res: Response) => {
    const salary = await Salary.findByPk(req.params.id)
    if (!salary) {
      throw new HttpException(404, "No salary found");
    }
    res.status(200).json({
      success: true,
      data: salary,
    });
    
  });
  private updatesalary = asyncWrap(async (req: Request, res: Response) => {
      const body:SalaryCreationAttributes = req.body
      const position = await Salary.update(body,{
        where:{
          id:req.params.id
        }
      })
      if (!position) {
        throw new HttpException(404, "No salary found");
      }
      res.status(200).json({
        success: true,
        data: position,
      });
  });
  private deletesalary = asyncWrap(async (req: Request, res: Response) => {
      const salary = await Salary.destroy({
        where:{
          id:req.params.id
        }
      })
      res.status(200).json({
        success: true
      })
  });
  private getspecificsalaryemployee = asyncWrap(async (req: Request, res: Response) => {
      const salary = await Salary.findByPk(req.params.id,{
        include:[{
          model:User,
          as:'salary_user'
        }]
      })
      if (!salary) {
        throw new HttpException(404, "No salary found");
      }
      res.status(200).json({
        success: true,
        data: salary,
      });
      
  });

  //calculating salary based on attendance
  private calculatesalary = asyncWrap(async (req:Request, res:Response,next)=>{
    let date = new Date()
    let id:any = req.params.id
    const att = await Attendance.findAll({
      where:{
        employee_id:id,
          [Op.and]:[
            Sequelize.literal(`EXTRACT(YEAR FROM "createdAt") = ${date.getFullYear()}`),
            Sequelize.literal(`EXTRACT(MONTH FROM "createdAt") = ${date.getMonth() + 1}`),
          ],
        }
    })
    const count = att.length;
    req.data = count;
    next()

  })

  private calculatesalarytwo = asyncWrap(async (req:Request,res:Response)=>{
    const usersalary = await User.findOne({
      where:{
        id:req.params.id
      },
      attributes:['salary']
    })
    if(!usersalary){return }
    const usersala = usersalary.salary?.toString()
    const data = req.data;

    const salary = await Salary.findOne({
      where:{
        id:usersala
      },
      attributes:['amount'],
    })
    if(!salary){return }
    const sala = salary.amount * data;
    
    res.status(200).json({
      success:true,
      date:{
        sala
      }
    })
  })
}