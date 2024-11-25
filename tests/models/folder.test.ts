import sequelize from "../../config/database";
import Folder from "../../models/Folder";
import User from "../../models/User";

describe("Folder Operations", () => {
  let user: User;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
    user = await User.create({
      username: "test",
      email: "test@gmail.com",
      password: "test",
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    await Folder.destroy({ where: {} });
  });

  it("should create a folder", async () => {
    const folder = await Folder.create({
      name: "folder",
      ownerId: user.username,
    });

    expect(folder).toBeDefined();
    expect(folder.ownerId).toBe(user.username);
  });

  it("should reject malformed foldernames", async () => {
    await expect(
      Folder.create({
        name: "/folder",
        ownerId: user.username,
      })
    ).rejects.toThrow("name failed");
  });

  it("it should reject same foldername in the same parent folder", async () => {
    await Folder.create({
      name: "folder",
      ownerId: user.username,
    });

    await expect(
      Folder.create({
        name: "Folder",
        ownerId: user.username,
      })
    ).rejects.toThrow("Folder already exists");
  });
});
