"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorMiddleware = function (err, req, res, _next) {
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
};
exports.default = errorMiddleware;
