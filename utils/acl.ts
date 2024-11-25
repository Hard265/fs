import Folder from "../models/Folder";
import FsACL from "../models/FsACL";

async function propagatePermissions(
  folderId: string,
  userId: string,
  permission: typeof FsACL.prototype.permission
) {
  // Fetch subfolders recursively
  const subfolders = await Folder.findAll({
    where: { parentFolderId: folderId },
  });

  // Assign permissions to subfolders
  for (const subfolder of subfolders) {
    await FsACL.create({
      folderId: subfolder.id,
      userId,
      permission,
    });

    // Recur for deeper subfolders
    await propagatePermissions(subfolder.id, userId, permission);
  }
}
