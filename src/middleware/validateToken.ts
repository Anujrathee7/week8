import { Request, Response, NextFunction } from "express";
import jwt,{ JwtPayload } from "jsonwebtoken";
import { User,IUser } from "../models/userModel";

interface authRequest extends Request{
    user?: JwtPayload
}

export const authenticateUser = async(req: authRequest, res:Response,next: NextFunction)=>{
    const token: string | undefined = req.header("authorization")?.split(" ")[1]
    
    if(!token){ return res.status(401).json({message: "Token not found."})}
    try{

        const payload: JwtPayload = jwt.verify(token, process.env.SECRET as string) as JwtPayload
        req.user = payload
        next();

    }catch(error){
        console.log(error)
        return res.status(404).json("error")
    }

}

export const authenticateAdmin = async(req:authRequest,res: Response, next: NextFunction)=>{
    const token: string | undefined = req.header("authorization")?.split(" ")[1] 
    if(!token){return res.status(403).json({message: "Access denied."})}

    try{
        const payload: JwtPayload = jwt.verify(token,process.env.SECRET as string) as JwtPayload
        req.user = payload
        if(req.user?.isAdmin){
            next()
        }else{
            return res.status(403).json({message: "Access denied."})      
        }
    } catch(error){
        console.log(error)
        return res.status(404).json("Internal Error")
    }
}

export default authRequest