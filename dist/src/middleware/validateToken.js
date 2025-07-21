"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateAdmin = exports.authenticateUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateUser = async (req, res, next) => {
    const token = req.header("authorization")?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Token not found." });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.SECRET);
        req.user = payload;
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(404).json("error");
    }
};
exports.authenticateUser = authenticateUser;
const authenticateAdmin = async (req, res, next) => {
    const token = req.header("authorization")?.split(" ")[1];
    if (!token) {
        return res.status(403).json({ message: "Access denied." });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.SECRET);
        req.user = payload;
        if (req.user?.isAdmin) {
            next();
        }
        else {
            return res.status(403).json({ message: "Access denied." });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(404).json("Internal Error");
    }
};
exports.authenticateAdmin = authenticateAdmin;
