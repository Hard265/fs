import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from "@sequelize/core";
import {
  PrimaryKey,
  Attribute,
  NotNull,
  HasMany,
  BeforeCreate,
  BeforeUpdate,
  Unique,
} from "@sequelize/core/decorators-legacy";
import { IsEmail, Min } from "@sequelize/validator.js";
import bcrypt from "bcrypt";

import Folder from "./Folder";
import File from "./File";
import FsACL from "./FsACL";

export default class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  @Attribute(DataTypes.STRING)
  @PrimaryKey
  @Unique
  declare username: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  @Unique
  @IsEmail
  declare email: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  @Min(6)
  declare password: string;

  /** Declared by {@link FsACL#user} */
  declare aclEntries?: FsACL[];

  @HasMany(() => Folder, {
    foreignKey: "ownerId",
    inverse: {
      as: "owner",
    },
  })
  declare folders: NonAttribute<Folder[]>;

  @HasMany(() => File, {
    foreignKey: "ownerId",
    inverse: {
      as: "owner",
    },
  })
  declare files: NonAttribute<File[]>;

  async validatePassword(password: string): Promise<NonAttribute<boolean>> {
    return bcrypt.compare(password, this.password);
  }

  @BeforeCreate
  static async hashPassword(user: User) {
    if (user.password) {
      const saltRounds = 10;
      user.password = await bcrypt.hash(user.password, saltRounds);
    }
  }

  @BeforeUpdate
  static async hashPasswordOnUpdate(user: User) {
    if (user.changed("password")) {
      const saltRounds = 10;
      user.password = await bcrypt.hash(user.password, saltRounds);
    }
  }
}
