import jwt from 'jsonwebtoken';
import type { Request } from 'express';
import type { Response } from 'express';
import type { NextFunction } from 'express';

export interface User{
  id:String,
  username:string,
  email:string
}

export const createJWT = (user: User): string => {
  const secret=process.env.JWT_SECRET;
  if(!secret){
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign(user, secret);
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  try {
    const decoded = jwt.verify(token, secret) as User;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};