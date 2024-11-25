import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  DataTypes,
  sql,
  CreationOptional,
  NonAttribute,
} from "@sequelize/core";
import {
  Attribute,
  BelongsTo,
  Default,
  NotNull,
  PrimaryKey,
} from "@sequelize/core/decorators-legacy";

import Folder from "./Folder";
import User from "./User";

export default class FsACL extends Model<
  InferAttributes<FsACL>,
  InferCreationAttributes<FsACL>
> {
  @Attribute(DataTypes.UUIDV4)
  @PrimaryKey
  @Default(() => sql.uuidV4)
  declare id: CreationOptional<string>;

  @BelongsTo(() => Folder, {
    foreignKey: "folderId",
    inverse: {
      as: "aclEntries",
      type: "hasMany",
    },
  })
  declare folder?: NonAttribute<Folder>;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare folderId: string;

  @BelongsTo(() => User, {
    foreignKey: "userId",
    inverse: {
      as: "aclEntries",
      type: "hasMany",
    },
  })
  declare user?: NonAttribute<User>;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare userId: string;

  @Attribute(DataTypes.ENUM("READ", "WRITE", "ADMIN"))
  @NotNull
  declare permission: "READ" | "WRITE" | "ADMIN";
}
