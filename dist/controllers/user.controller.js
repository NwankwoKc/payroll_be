"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = void 0;
const express_1 = require("express");
const asyncWrapper_1 = __importDefault(require("../utils/asyncWrapper"));
const http_exception_1 = __importDefault(require("../utils/http.exception"));
const user_1 = __importDefault(require("../db/model/user"));
const uuid_1 = require("uuid");
const sequelize_1 = require("sequelize");
const multer_1 = __importDefault(require("multer"));
const create_image_1 = __importDefault(require("../middlewares/create.image"));
const create_image_2 = require("../middlewares/create.image");
const department_1 = __importDefault(require("../db/model/department"));
const postion_1 = __importDefault(require("../db/model/postion"));
class user {
    constructor() {
        //create user
        this.createuser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let userData = req.body;
                const existingUsers = yield user_1.default.findAll({
                    where: {
                        [sequelize_1.Op.or]: {
                            phonenumber: userData.phonenumber,
                            email: userData.email,
                        },
                    },
                });
                if (existingUsers.length > 0) {
                    const exitstingFields = [];
                    existingUsers.forEach((user) => {
                        if (user.email === userData.email.toLowerCase()) {
                            exitstingFields.push("email");
                        }
                    });
                    const message = exitstingFields.join(" and ");
                    throw new http_exception_1.default(409, `User with the provided ${message} already exists`);
                }
                console.log(req.body);
                req.body.type = "nuban";
                // req.body.profileimage = fileUrl;
                const data = yield user_1.default.create(req.body);
                res.status(201).json({
                    success: true,
                    data
                });
            }
            catch (error) {
                console.error('User creation error:', error);
                res.status(400).json({
                    success: false,
                    error: error.message
                });
            }
        });
        //get all users
        this.getUser = (0, asyncWrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const users = yield user_1.default.findAll();
            // Logic to get user by ID
            res.status(200).json({
                data: users,
                success: true
            });
        }));
        this.getspecificUser = (0, asyncWrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.id;
            const user = yield user_1.default.findByPk(userId, {
                include: [{
                        model: department_1.default,
                        as: "employee_department"
                    },
                    {
                        model: postion_1.default,
                        as: "user_position"
                    }]
            });
            // Logic to get specific user by ID  
            res.status(200).json({
                data: user,
                success: true
            });
        }));
        this.updateUser = (0, asyncWrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.id;
            const updatedData = req.body;
            // Logic to update user by ID
            const user = yield user_1.default.update(req.body, {
                where: { id: userId }
            });
            res.status(200).json({
                success: true,
                message: `User with ID ${userId} updated successfully`,
                data: updatedData
            });
        }));
        this.deleteUser = (0, asyncWrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.id;
            yield user_1.default.destroy({
                where: {
                    id: userId
                }
            });
            res.status(200).json({
                message: `User with ID ${userId} deleted successfully`,
                success: true
            });
        }));
        this.uploadprofile = (0, asyncWrapper_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.id;
            const user = yield user_1.default.findByPk(userId);
            if (!user) {
                throw new http_exception_1.default(404, "User not found");
            }
            const file = req.file;
            if (!file) {
                throw new http_exception_1.default(400, "No file uploaded");
            }
            const fileName = `${(0, uuid_1.v4)()}-${file.originalname}`;
            const fileBuffer = file.buffer;
            const uploadimage = yield (0, create_image_1.default)(fileBuffer, fileName);
            // Save the file to the server or cloud storage 
            if (uploadimage) {
                const fileUrl = (0, create_image_2.getFileUrl)(fileName);
                if (typeof fileUrl !== 'string') {
                    throw new http_exception_1.default(500, "Failed to generate file URL");
                }
                user.profileimage = fileUrl;
                yield user.save();
            }
            else {
                res.status(500).json({
                    message: "Failed to upload file",
                    success: false
                });
                return;
            }
            res.status(200).json({
                message: "Profile picture uploaded successfully",
                fileName: fileName,
                success: true
            });
        }));
        this.router = (0, express_1.Router)();
        this.storage = multer_1.default.memoryStorage();
        this.upload = (0, multer_1.default)({ storage: this.storage });
        this.initRoutes();
    }
    initRoutes() {
        this.router.get('/user', this.getUser);
        this.router.post('/user', this.createuser);
        this.router.get('/user/:id', this.getspecificUser);
        this.router.put('/user/:id', this.updateUser);
        this.router.delete('/user/:id', this.deleteUser);
        this.router.post('/user/uploadprofile/:id', this.upload.single('profileimage'), this.uploadprofile);
    }
}
exports.user = user;
