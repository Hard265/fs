import "dotenv/config";
import express from "express";
import sequelize from "./config/database";

import authRouter from "./routes/auth";
import fsRouter from "./routes/fs";
import authenticate from "./middlewares/jwtAuthentication";
import authorizeFolder from "./middlewares/authorizeFolder";

const app = express();
app.use(express.json());

app.use("/", authRouter);
app.use("/:username/*", authenticate, authorizeFolder, fsRouter);

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  sequelize
    .sync()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    })
    .catch((e) => {
      console.log("failed to sync the database", e);
    });
}

export default app;
