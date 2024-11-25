import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest } from "../types";

import jwt from "jsonwebtoken";
import User from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET as string;

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    //@ts-ignore
    req.user = await User.findByPk(decoded.username);
    //@ts-ignore
    if (!req.user) {
      return res.status(401).json({ error: "Invalid token." });
    }
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};
export default authenticate;
