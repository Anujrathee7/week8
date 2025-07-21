"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userModel_1 = require("../models/userModel");
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const inputValidaton_1 = require("../validators/inputValidaton");
const express_validator_1 = require("express-validator");
const validateToken_1 = require("../middleware/validateToken");
const Topic_1 = require("../models/Topic");
dotenv_1.default.config();
const router = (0, express_1.Router)();
router.post('/user/register', inputValidaton_1.registerValidation, async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }
    try {
        const { email, password, username, isAdmin } = req.body;
        const existingUser = await userModel_1.User.findOne({ email });
        console.log(existingUser);
        if (existingUser) {
            return res.status(403).json({ email: "Email already in use" });
        }
        const salt = bcrypt_1.default.genSaltSync(10);
        const hash = bcrypt_1.default.hashSync(password, salt);
        const user = await userModel_1.User.create({ email, password: hash, username, isAdmin });
        return res.json(user);
    }
    catch (error) {
        console.log(error);
        return res.status(404).json("Server error");
    }
});
router.post("/user/login", inputValidaton_1.loginValidation, async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { email, password } = req.body;
        const user = await userModel_1.User.findOne({ email });
        console.log(user);
        if (user && bcrypt_1.default.compareSync(password, user.password)) {
            const jwtPayload = {
                _id: user._id,
                username: user.username,
                isAdmin: user.isAdmin
            };
            const token = jsonwebtoken_1.default.sign(jwtPayload, process.env.SECRET, { expiresIn: "1h" });
            return res.status(200).json({ success: true, token: token });
        }
        else {
            return user ?
                res.status(401).json({ message: "Try Again" }) :
                res.status(404).json({ error: "user not found" });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(404).json("Internal server error");
    }
});
router.get('/topics', async (req, res) => {
    try {
        const tasks = await Topic_1.Topic.find({});
        return res.json(tasks);
    }
    catch (error) {
        console.log(error);
        res.status(404).json("Server Error");
    }
});
router.post('/topic', validateToken_1.authenticateUser, async (req, res) => {
    try {
        const { title, content } = req.body;
        const username = req.user?.username;
        const topic = await Topic_1.Topic.create({
            title,
            content,
            username,
            createdAt: new Date()
        });
        return res.status(200).json(topic);
    }
    catch (error) {
        console.log(error);
        res.status(404).json("Server Error");
    }
});
router.delete('/topic/:id', validateToken_1.authenticateAdmin, async (req, res) => {
    try {
        await Topic_1.Topic.findByIdAndDelete(req.params.id);
        return res.json({ message: 'Topic deleted successfully.' });
    }
    catch (error) {
        return res.status(404).json("Error deleting topic");
    }
});
exports.default = router;
