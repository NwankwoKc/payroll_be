
import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import asyncWrap from "../../utils/asyncWrapper";
import { Op } from "sequelize";
import HttpException from "../../utils/http.exception";
import User from "../../db/model/user";
// import { db } from "../../db/models";
import "dotenv/config";
import { UUID } from "sequelize";

import { user } from "../user.controller";


type SignUpData = {
  firstName: string;
  lastName: string;
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
    let loginData = req.body;

    const existingUser = await User.findOne({
      where: { email: loginData.email,
               password: loginData.password,
       },
    });

    if (!existingUser) {
      throw new HttpException(401, "Invalid login credentials");
    }

    const uid = existingUser?.id;
    const payload = {
      uid: uid,
    };

    const secretKey = process.env.SECRETKEY as string;
    const token = jwt.sign(payload, secretKey, {
      expiresIn: "1d",
    });

    res.status(200).json({
      success: true,
      user,
      token,
    });
  });
}