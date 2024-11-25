import { Router } from "express";
import { AuthenticatedFolderRequest } from "../types";
import Folder from "../models/Folder";
import { checkPermission } from "../middlewares/checkPermission";

const router = Router({ mergeParams: true });

router.get(
  "",
  //@ts-ignore
  (req: AuthenticatedFolderRequest, res) => {
    res.send(req.folder);
  }
);

router.post(
  "/*",
  //@ts-ignore
  async (req: AuthenticatedFolderRequest, res) => {
    const { name } = req.body;

    try {
      const folder = await Folder.create({
        name,
        parentFolderId: req.folder.id || null,
        ownerId: req.user.username,
      });
      res.status(201).json(folder);
    } catch (error: any) {
      res
        .status(500)
        .json({ error: "Internal Server Error", message: error.message });
    }
  }
);

//@ts-ignore
router.delete("/*", async (req: AuthenticatedFolderRequest, res) => {
  const { id } = req.body;

  try {
    await req.folder.destroy();
    res.status(200).json({
      message: `Folder deleted`,
    });
  } catch {
    res.status(400).json({ error: "Internal Server Error" });
  }
});

router.put("/*", (req, res) => {
  res.send("fs route");
});

export default router;
