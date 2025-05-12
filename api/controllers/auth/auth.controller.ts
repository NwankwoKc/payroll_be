
import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import asyncWrap from "../../utils/asyncWrapper";
import { Op } from "sequelize";
import HttpException from "../../utils/http.exception";
import User from "../../db/model/user";
// import { db } from "../../db/models";
import "dotenv/config";
import { UUID } from "sequelize";
import bcrypt from "bcryptjs";
import { user } from "../user.controller";


type loginData = {
  email: string;
  password: string;

};


export class AuthController {
  router: Router;

  constructor() {
    this.router = Router();
    this.initRoutes();
  }

  initRoutes() {;
    this.router.post("/auth/login", this.login);
  }

  private login = asyncWrap(async (req: Request, res: Response) => {
    let loginData:loginData = req.body;

    const existingUser = await User.findOne({
      where: { email: loginData.email},
    });

    if (!existingUser) {
      throw new HttpException(401, "Invalid login credentials");
    }

    const isPasswordValid = await bcrypt.compareSync(req.body.password, existingUser.password);
    if (!isPasswordValid) {
      throw new HttpException(401, "Invalid login credentials");
    }

    const uid = existingUser?.id;
    const payload = {
      uid: uid,
    };
    res.status(200).json({
      success: true,
      user
    });
  });
}