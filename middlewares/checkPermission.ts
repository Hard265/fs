import { Request, Response, NextFunction } from "express";
import { AuthenticatedFolderRequest, AuthenticatedRequest } from "../types";
import FsACL from "../models/FsACL";

export async function checkPermission(
  permission: typeof FsACL.prototype.permission
) {
  return async (
    req: AuthenticatedFolderRequest,
    res: Response,
    next: NextFunction
  ) => {
    const userId = req.user.username;
    const folder = req.folder;

    const aclEntry = await FsACL.findOne({
      where: { userId, folderId: folder.id },
    });

    if (!aclEntry) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Check if user has the required permission
    const allowedPermissions = ["READ", "WRITE", "ADMIN"];
    if (
      allowedPermissions.indexOf(aclEntry.permission) <
      allowedPermissions.indexOf(permission)
    ) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    next();
  };
}
