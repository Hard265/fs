import { Request } from "express";
import User from "../models/User";
import Folder from "../models/Folder";

export interface AuthenticatedRequest extends Request {
  user: User;
}
export interface AuthenticatedFolderRequest extends AuthenticatedRequest {
  folder: Folder;
}
