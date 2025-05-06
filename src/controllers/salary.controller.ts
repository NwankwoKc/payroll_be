import { Request, Response, Router } from "express";
import asyncWrap from "../utils/asyncWrapper";
import HttpException from "../utils/http.exception";
import { Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import  User  from "../db/model/user";
import { Salary, SalaryCreationAttributes } from "../db/model/salary";

export class salary {
  router: Router;

  constructor() {
    this.router = Router();
    this.initRoutes();
  }

  initRoutes() {;
    this.router.get("/salary", this.getsalary);
    this.router.post("/salary", this.createsalary);
    this.router.get("/salary/:id", this.getspecificsalary);
    this.router.get("/salary/employee/:id", this.getspecificsalaryemployee);
    this.router.put("/salary/:id", this.updatesalary);
    this.router.delete("/salary/:id", this.deletesalary);
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
  private createsalary = asyncWrap(async (req: Request, res: Response) => {
    const salary:SalaryCreationAttributes = req.body;
    const check = await Salary.findAll({
        where:{
            name:salary.name
        }
    })

    if(check){
       throw new HttpException(400,'salary name already exits')
    }

    await Salary.create(req.body)

    res.status(200).json({
      success:true
    })
  });
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
        throw new HttpException(404, "No departments found");
      }
      res.status(200).json({
        success: true,
        data: salary,
      });
      
  });
}