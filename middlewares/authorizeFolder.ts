import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest } from "../types";
import Folder from "../models/Folder";
import File from "../models/File";

const authorizeFolder = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const folderPath = req.params[0];
  const segments = folderPath.split("/").filter(Boolean);

  const isOwner = req.user.username === req.params.username;

  if (isOwner) {
    try {
      if (!folderPath || folderPath.trim() === "") {
        try {
          const folders = await Folder.findAll({
            where: { parentFolderId: null },
            raw: true,
            attributes: ["name"],
          });
          const files = await File.findAll({
            where: { folderId: null },
            raw: true,
            attributes: ["name"],
          });
          //@ts-ignore
          req.folder = {
            id: null,
            name: null,
            parentFolderId: null,
            path: "/",
            folders,
            files,
          };
          return next();
        } catch (error: any) {
          res.status(500).json({ error: error.message });
          return;
        }
      } else {
        try {
          let currentFolder = null;
          for (const segment of segments) {
            currentFolder = await Folder.findOne({
              //@ts-ignore
              where: {
                name: segment,
                parentFolderId: currentFolder ? currentFolder.id : null,
              },
            });
            if (!currentFolder) {
              res.status(404).json({ error: `Folder "${segment}" not found` });
              return;
            }
          }

          currentFolder = await Folder.findOne({
            where: {
              name: currentFolder?.name,
              parentFolderId: currentFolder
                ? currentFolder.parentFolderId
                : null,
            },
            include: [
              { association: "parentFolder", attributes: ["id", "name"] },
              {
                association: "folders",
                attributes: ["id", "name"],
              },
              {
                association: "files",
                attributes: ["id", "name"],
              },
            ],
            attributes: ["id", "path"],
          });
          //@ts-ignore
          req.folder = currentFolder;
          return next();
        } catch (error: any) {
          res.send(error.message);
        }
      }
    } catch {}
  }

  return res
    .status(403)
    .json({ error: "Access denied. Folder not found or unauthorized." });
};

export default authorizeFolder as unknown as () => void;
