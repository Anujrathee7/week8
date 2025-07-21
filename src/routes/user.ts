import { Response,Request,Router } from "express";
import bcrypt from "bcrypt"; 
import { User,IUser } from "../models/userModel";
import dotenv from "dotenv";
import jwt,{ JwtPayload } from "jsonwebtoken";
import { registerValidation, loginValidation } from "../validators/inputValidaton";
import { validationResult } from "express-validator";
import authRequest,{ authenticateAdmin, authenticateUser } from "../middleware/validateToken";
import { Task,ITask } from "../models/Topic";

dotenv.config()

const router: Router = Router()

router.post('/user/register',registerValidation, async (req: Request, res:Response)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({error: errors.array()})
    }
    try{
    const {email,password,username,isAdmin} = req.body

    const existingUser: IUser | null = await User.findOne({email})

    console.log(existingUser)

    if(existingUser){
        return res.status(403).json({email: "Email already in use"})
    }
    const salt: string = bcrypt.genSaltSync(10)
    const hash: string = bcrypt.hashSync(password,salt)

    const user: IUser = await User.create({email,password: hash,username,isAdmin})

    return res.json(user)

    }catch(error){
        console.log(error)
        return res.status(404).json("Server error")
    }
})

router.post("/user/login", loginValidation, async(req: Request, res: Response)=>{
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try{
        const {email,password} = req.body

        const user: IUser | null = await User.findOne({email})

        console.log(user)

        if(user && bcrypt.compareSync(password,user.password)){

            const jwtPayload: JwtPayload = {
                _id: user._id,
                username: user.username,
                isAdmin: user.isAdmin
            }

            const token: string = jwt.sign(jwtPayload,process.env.SECRET as string , {expiresIn: "1h"})

            return res.status(200).json({success: true, token: token})

        }else{
            return user ? 
            res.status(401).json({message:"Try Again"}) : 
            res.status(404).json({error: "user not found"})
        }

    }catch(error){
        console.log(error)
        return res.status(404).json("Internal server error")
    }
})

router.get('/topics',async(req: Request, res:Response)=>{
    try{
        const tasks: ITask[] = await Task.find({})

        return res.json(tasks)

    } catch(error){
        console.log(error)
        res.status(404).json("Server Error")
    }
})

router.post('/topic',authenticateUser,async(req: authRequest, res: Response)=>{
    try{
        const {title,content} = req.body
        const username = req.user?.username

        const topic: ITask = await Task.create({
            title,
            content,
            username,
            createdAt: new Date()
        })

    }catch(error){
        console.log(error)
        res.status(404).json("Server Error")
    }
})

router.delete('/topic/:id',authenticateAdmin,async (req: Request, res: Response)=>{
    try{
        await Task.findByIdAndDelete(req.params.id)
        return res.json({ message: 'Topic deleted successfully.' });

    }catch(error){
        return res.status(404).json("Error deleting topic")
    }
})

export default router