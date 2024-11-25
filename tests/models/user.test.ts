import sequelize from "../../config/database";
import User from "../../models/User";
import bcrypt from "bcrypt";

describe("User model operations", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    await User.destroy({ where: {} });
  });

  it("should have a valid email address", async () => {
    await expect(
      User.create({
        username: "test",
        email: "test",
        password: "123456",
      })
    ).rejects.toThrow();
  });

//   it("should have a valid password requirements", async () => {
//     await expect(
//       User.create({
//         username: "test",
//         email: "test@gmail.com",
//         password: "12345",
//       })
//     ).rejects.toThrow();
//   });

  it("should hash the password before save", async () => {
    const password = "123456";
    const user = await User.create({
      username: "test",
      email: "test@gmail.com",
      password,
    });
    expect(user.password).not.toBe(password);
  });

  it("should force unique username and email", async () => {
    await User.create({
      username: "usernameTest",
      email: "test@gmail.com",
      password: "123456",
    });

    await User.create({
      username: "emailTest",
      email: "test2@gmail.com",
      password: "123456",
    });

    await expect(
      User.create({
        username: "usernameTest",
        email: "test3@gmail.com",
        password: "123456",
      })
    ).rejects.toThrow();

    await expect(
      User.create({
        username: "emailTest2",
        email: "test2@gmail.com",
        password: "123456",
      })
    ).rejects.toThrow();
  });
});
