"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function pageNotFoundMiddleware(req, res, next) {
    res.status(404).json({
        success: false,
        message: `${req.method} '${req.url}' not found`,
    });
}
exports.default = pageNotFoundMiddleware;
