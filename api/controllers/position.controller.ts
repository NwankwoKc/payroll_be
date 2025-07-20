import { Request, Response, Router } from "express";
import asyncWrap from "../utils/asyncWrapper";
import HttpException from "../utils/http.exception";
import { Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import Position, { positioncreationattribute } from "../db/model/postion";
import  User  from "../db/model/user";

export class position {
  router: Router;

  constructor() {
    this.router = Router();
    this.initRoutes();
  }

  initRoutes() {;
    this.router.get("/positions", this.getpositions);
    this.router.post("/positions", this.createpositions);
    this.router.get("/positions/:id", this.getspecificpositions);
    this.router.get("/positions/employee/:id", this.getspecificpositionsemployee);
    this.router.put("/positions/:id", this.updatepositions);
    this.router.delete("/positions/:id", this.deletepositions);
  }

  private getpositions = asyncWrap(async (req: Request, res: Response) => {
    const position = await Position.findAll();
    if (!position) {
      throw new HttpException(404, "No positions found");
    }
    res.status(200).json({
      success: true,
      data: position,
    });
  })
  
  private createpositions = asyncWrap(async (req: Request, res: Response) => {
    const position:positioncreationattribute = req.body;
    const check = await Position.findAll({
        where:{
            name:position.name
        }
    })

    if(check.length > 0){
       throw new HttpException(400,'department name already exits')
    }

    await Position.create(req.body)

    res.status(200).json({
      success:true
    })
  });

  private getspecificpositions = asyncWrap(async (req: Request, res: Response) => {
    const position = await Position.findByPk(req.params.id)
    if (!position) {
      throw new HttpException(404, "No departments found");
    }
    res.status(200).json({
      success: true,
      data: position,
    });
    
  });
  private updatepositions = asyncWrap(async (req: Request, res: Response) => {
      const body:positioncreationattribute = req.body
      const position = await Position.update(body,{
        where:{
          id:req.params.id
        }
      })
      if (!position) {
        throw new HttpException(404, "No departments found");
      }
      res.status(200).json({
        success: true,
        data: position,
      });
  });
  private deletepositions = asyncWrap(async (req: Request, res: Response) => {
      const position = await Position.destroy({
        where:{
          id:req.params.id
        }
      })
      res.status(200).json({
        success: true
      })
  });
  private getspecificpositionsemployee = asyncWrap(async (req: Request, res: Response) => {
      const employee = await Position.findByPk(req.params.id,{
        include:[{
          model:User,
          as:'position_user'
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