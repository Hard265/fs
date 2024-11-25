import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  sql,
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
} from "@sequelize/core/decorators-legacy";
import Folder from "./Folder";
import User from "./User";

export default class File extends Model<
  InferAttributes<File>,
  InferCreationAttributes<File>
> {
  @Attribute(DataTypes.UUIDV4)
  @PrimaryKey
  @Default(() => sql.uuidV4)
  declare id: CreationOptional<string>;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare name: string;

  /** Defined by {@link User.files} */
  declare owner: NonAttribute<User>;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare ownerId: string;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare size: number;

  /** Defined by {@link Folder.files} */
  declare folder?: NonAttribute<Folder>;

  @Attribute(DataTypes.STRING)
  @AllowNull
  declare folderId: CreationOptional<string | null>;

  get path(): NonAttribute<string> {
    if (!this.folder) {
      return `/${this.name}`;
    }
    return `${this.folder.path}/${this.name}`;
  }
}
