
import { Request, Response, Router } from "express";
import asyncWrap from "../utils/asyncWrapper";
import HttpException from "../utils/http.exception";
import { Op } from "sequelize";
import { departmentcreationattribute } from "../db/model/department";
import { v4 as uuidv4 } from "uuid";
import Department from "../db/model/department";
import errorMiddleware from "../middlewares/error.middleware";
import  User  from "../db/model/user";


export class department {
  router: Router;

  constructor() {
    this.router = Router();
    this.initRoutes();
  }

  initRoutes() {;
    this.router.get("/departments", this.getdepartment);
    this.router.post("/departments", this.createdepartment);
    this.router.get("/departments/:id", this.getspecificdepartmentemployee);
    this.router.put("/departments/:id", this.updatedepartment);
    this.router.delete("/departments/:id", this.deletedepartment);
  }

  private getdepartment = asyncWrap(async (req: Request, res: Response) => {
    const department = await Department.findAll();
    if (!department) {
      throw new HttpException(404, "No departments found");
    }
    res.status(200).json({
      success: true,
      data: department,
    });
  })

  private createdepartment = asyncWrap(async (req: Request, res: Response) => {
    const departmentbody:departmentcreationattribute = req.body;
    const check = await Department.findAll({
        where:{
            name:departmentbody.name
        }
    })

    if(check.length > 0){
       throw new HttpException(400,'department name already exits')
    }

    await Department.create(req.body)

    res.status(200).json({
      success:true
    })
  });

  private getspecificdepartment = asyncWrap(async (req: Request, res: Response) => {
    const department = await Department.findByPk(req.params.id)
    if (!department) {
      throw new HttpException(404, "No departments found");
    }
    res.status(200).json({
      success: true,
      data: department,
    });
    
  });
  private updatedepartment = asyncWrap(async (req: Request, res: Response) => {
      const body:departmentcreationattribute = req.body
      const department = await Department.update(body,{
        where:{
          id:req.params.id
        }
      })
      if (!department) {
        throw new HttpException(404, "No departments found");
      }
      res.status(200).json({
        success: true,
        data: department,
      });
  });
  private deletedepartment = asyncWrap(async (req: Request, res: Response) => {
      const department = await Department.destroy({
        where:{
          id:req.params.id
        }
      })
      res.status(200).json({
        success: true
      })
  });
  private getspecificdepartmentemployee = asyncWrap(async (req: Request, res: Response) => {
      const employee = await  Department.findByPk(req.params.id,{
        include:[{
          model:User,
          as:'department_users'
        }]
      })
      if (!employee) {
        throw new HttpException(404, "No departments found");
      }
      res.status(200).json({
        success: true,
        data: employee,
      });
      
  });
}