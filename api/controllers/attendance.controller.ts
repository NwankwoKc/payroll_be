import { Request, Response, Router } from "express";
import asyncWrap from "../utils/asyncWrapper";
import HttpException from "../utils/http.exception";
import { Op } from "sequelize";
import { departmentcreationattribute } from "../db/model/department";
import { v4 as uuidv4 } from "uuid";
import Attendance, { attendancecreationattribute } from "../db/model/attendance";
import errorMiddleware from "../middlewares/error.middleware";
import  User  from "../db/model/user";
import { calculatesalary } from "../utils/calculate.salary";


export class attendance {
  router: Router;

  constructor() {
    this.router = Router();
    this.initRoutes();
  }

  initRoutes() {;
    this.router.get("/attendance", this.getattendance);
    this.router.post("/attendance", this.createattendance);
    this.router.get("/attendance/:id", this.getspecificattendance);
    this.router.put("/attendance/:id", this.updateattendance);
    this.router.delete("/attendance/:id", this.deleteattendance);
  }

  private getattendance = asyncWrap(async (req: Request, res: Response) => {
    const attendance:any = await Attendance.findAll();
    if (!attendance) {
      throw new HttpException(404, "No attendance found");
    }
    console.log(attendance.createdAt)
    res.status(200).json({
      success: true,
      data: attendance,
    });
  })
  private createattendance = asyncWrap(async (req: Request, res: Response) => {
    const attendance:attendancecreationattribute = req.body;
    const id = req.body.id
    attendance.employee_id = id;
    const date = new Date();
    const dateWithoutTime = date.toDateString();
    const check = await Attendance.findAll({
        where:{
            employee_id:attendance.employee_id,
            created_at:dateWithoutTime
        }
    })
    
    if(check.length > 0){
       throw new HttpException(400,'attendance already exits')
    }
 
    const hours = date.getHours();
    if(hours > 9){
        attendance.status = "late"
    }
    else{
        attendance.status = "punctual"
    }    
  
    attendance.created_at = dateWithoutTime;
    await Attendance.create(req.body)
    calculatesalary(id);
    res.status(200).json({
      success:true
    })
  });

  private getspecificattendance = asyncWrap(async (req: Request, res: Response) => {
    const attendance:any = await Attendance.findAll({
      where: {
        employee_id:req.params.id
      }
    })
    if(!attendance) {
      throw new HttpException(404, "No attendance found");
    }
    // const dateString = attendance.created_at
    // const parts = dateString.split(' ');
    // const monthAbbreviation = parts[1]; // "Sep"
    // console.log(monthAbbreviation); // Output: Sep
  
      
    res.status(200).json({
      success: true,
      data: attendance
    });
    
  });
  private updateattendance = asyncWrap(async (req: Request, res: Response) => {
      const attendance:departmentcreationattribute = req.body
      const check = await Attendance.update(attendance,{
        where:{
          id:req.params.id
        }
      })
      if (!check) {
        throw new HttpException(404, "No attendance found");
      }
      res.status(200).json({
        success: true,
        data: check,
      });
  });
  private deleteattendance = asyncWrap(async (req: Request, res: Response) => {
      const attendance = await Attendance.destroy({
        where:{
          id:req.params.id
        }
      })
      res.status(200).json({
        success:true
      })
  });
}