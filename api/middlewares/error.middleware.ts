import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import HttpException from "../utils/http.exception";

const errorMiddleware = function(
  err: HttpException,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);

  console.log(err);

  return res.json({
    success: false,
    message: err.message || "something went wrong",
  });
}

export default errorMiddleware;