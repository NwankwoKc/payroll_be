import { Router } from 'express';
import asyncWrap from '../utils/asyncWrapper';
import HttpException from '../utils/http.exception';    
import { Request, Response } from 'express';
import User from '../db/model/user';
import { where } from 'sequelize';
import {usercreationattribute} from "../db/model/user"
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import multer from 'multer';
import uploadFile from '../middlewares/create.image';

export class user {
    router: Router;
    constructor() {
        this.router = Router();
        this.initRoutes();
    }
    initRoutes() {
        this.router.get('/user', this.getUser);
        this.router.post('/user', this.createuser);
        this.router.get('/user/:id', this.getUser);
        this.router.put('/user/:id', this.updateUser);
        this.router.delete('/user/:id', this.deleteUser);
        this.router.post('/user/uploadprofile/:id',this.uploadprofile)
    }   
    private createuser = asyncWrap(async (req:Request,res:Response) => {

 
        let userData:usercreationattribute = req.body;
  
        const existingUsers = await User.findAll({
          where: {
            [Op.or]: {
              phonenumber: userData.phonenumber,
              email: userData.email,
            },
          },
        });
  
        if (existingUsers.length) {
          const exitstingFields: string[] = [];
  
          existingUsers.forEach((user:any) => {
            if (user.email === userData.email.toLowerCase()) {
              exitstingFields.push("email");
            }
          });
  
          const message = exitstingFields.join(" and ");
  
          throw new HttpException(
            409,
            `User with the provided ${message} already exists`,
          );
        }
        let createdUser = await User.create({
          id: uuidv4() as `${string}-${string}-${string}-${string}-${string}`,
          firstname: userData.firstname,
          lastname: userData.lastname,
          email: userData.email,
          password: userData.password,
          postion: userData.postion,
          department: userData.department,
          experience: "",
          hiredate: userData.hiredate,
          sex: "",
          phonenumber: 0,
          jobtitle: "",
          salary: uuidv4() as `${string}-${string}-${string}-${string}-${string}`,
          bankaccount: 0,
          bankname: userData.bankname,
          role: uuidv4() as `${string}-${string}-${string}-${string}-${string}`,
          payment: []
        });
        
        res.status(201).json({
          success: true
        });
      },
    );

    getUser = asyncWrap(async (req: Request, res:Response) => {
        const users = await User.findAll();
        // Logic to get user by ID
        res.status(200).json({ 
            data: 'users',
            success:true
        });
    });
    getspecificUser = asyncWrap(async (req, res) => {
        const userId = req.params.id;
        const user = await User.findByPk(userId);
        // Logic to get specific user by ID  
        res.status(200).json({
             data: user,
             success:true
             });
    });
    

    updateUser = asyncWrap(async (req, res) => {
        const userId = req.params.id;
        const updatedData = req.body;
        // Logic to update user by ID
        const user = await User.update(req.body, { 
            where: { id: userId }}
        )
        res.status(200).json({ 
            success:true,
            message: `User with ID ${userId} updated successfully`,
            data: updatedData });
    }
    );
    deleteUser = asyncWrap(async (req, res) => {
        const userId = req.params.id; 
        await User.destroy({
            where:{
                id:userId
            }
        })
        res.status(200).json({ 
            message: `User with ID ${userId} deleted successfully` ,
            success:true
        });
    })
    uploadprofile = asyncWrap(async (req:Request,res:Response) => {
      const storage = multer.memoryStorage()
      const userId = req.params.id;
      const user = await User.findByPk(userId);
      if (!user) {
        throw new HttpException(404, "User not found");
      }
      const file = req.file;
      if (!file) {
        throw new HttpException(400, "No file uploaded");
      }
      const fileName = `${uuidv4()}-${file.originalname}`;
      const filePath = req.file?.path; 
      const fileBuffer = file.buffer;
      if(filePath)
      // Save the file to the server or cloud storage 
      await uploadFile(fileBuffer,fileName, filePath);
      // Update the user's profile picture URL in the database
      res.status(200).json({
        message: "Profile picture uploaded successfully",
        fileName: fileName,
        filePath: filePath,
        success:true
      });
    })
}