import { NextFunction, Request, RequestHandler, Response } from "express";

const asyncWrap = (callback: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await callback(req, res, next);
    } catch (error: any) {
      next(error);
    }
  };
};

export default asyncWrap;