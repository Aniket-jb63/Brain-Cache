import { NextFunction,Response,Request } from "express";
import jwt from "jsonwebtoken"
declare global{
  namespace Express{
    interface Request{
      id:string
    }
  }
}

export const jwtAuth=(req:Request,res:Response,next:NextFunction)=>{
  try {
    const token = req.headers.token as string;
    if (!token) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    if (!decoded.id) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }

    req.id = decoded.id;
    next();
  } catch (error) {
    res.status(500).send("Authorization Error")
  }
}