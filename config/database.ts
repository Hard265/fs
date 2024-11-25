import Sequelize from "@sequelize/core";
import { SqliteDialect } from "@sequelize/sqlite3";

import Folder from "../models/Folder";
import File from "../models/File";
import User from "../models/User";
import FsACL from "../models/FsACL";

const sequelize = new Sequelize({
  dialect: SqliteDialect,
  storage: "db.sqlite3",
  models: [Folder, File, User, FsACL],
});

export default sequelize;
