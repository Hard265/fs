import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  sql,
  Op,
} from "@sequelize/core";
import {
  PrimaryKey,
  Attribute,
  AutoIncrement,
  NotNull,
  HasMany,
  BelongsTo,
  Default,
  AllowNull,
  ModelValidator,
  Unique,
  AfterCreate,
} from "@sequelize/core/decorators-legacy";

import File from "./File";
import User from "./User";
import { Is } from "@sequelize/validator.js";
import FsACL from "./FsACL";

export default class Folder extends Model<
  InferAttributes<Folder>,
  InferCreationAttributes<Folder>
> {
  @Attribute(DataTypes.UUIDV4)
  @PrimaryKey
  @Default(() => sql.uuidV4)
  declare id: CreationOptional<string>;

  @Attribute(DataTypes.STRING)
  @NotNull
  @Is(/^[^/]{1,255}$/)
  @Unique("folder_name_owner_parent")
  declare name: string;

  declare owner: NonAttribute<User>;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare ownerId: string;

  /** Declared by {@link FsACL#folder} */
  declare aclEntries?: FsACL[];

  /** Defined by {@link Folder.folders} */
  declare parentFolder?: NonAttribute<Folder>;

  @Attribute(DataTypes.STRING)
  @AllowNull
  declare parentFolderId: CreationOptional<string | null>;

  @HasMany(() => Folder, {
    foreignKey: "parentFolderId",
    inverse: {
      as: "parentFolder",
    },
  })
  declare folders?: NonAttribute<Folder[]>;

  @HasMany(() => File, {
    foreignKey: "folderId",
    inverse: {
      as: "folder",
    },
  })
  declare files?: NonAttribute<File[]>;

  @Attribute(DataTypes.VIRTUAL(DataTypes.STRING, ["name"]))
  get path(): CreationOptional<string> {
    if (!this.parentFolder) {
      return `/${this.name}`;
    }
    const parentFolder = this.parentFolder;
    return `${parentFolder.path}/${this.name}`;
  }

  @ModelValidator
  async onValidate() {
    const folders = await Folder.findAll({
      where: {
        ownerId: this.ownerId,
        name: {
          [Op.like]: sql.fn("lower", sql.attribute("name")),
        },
        parentFolderId: this.parentFolderId || null,
      },
    });
    if (folders.length > 0) {
      throw new Error("Folder already exists");
    }
  }

  @AfterCreate
  static async assignPermissions(folder: Folder) {
    try {
      await FsACL.create({
        folderId: folder.id,
        userId: folder.ownerId,
        permission: "ADMIN",
      });
    } catch (error) {
      console.error("Failed to assign initial folder permissions:", error);
    }
  }
}
