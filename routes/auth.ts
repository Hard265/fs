import { Router } from "express";
import _ from "lodash";
import jwt from "jsonwebtoken";

import User from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET as string;

const router = Router();

router.post("/signup", async (req, res): Promise<any> => {
  const { username, email, password } = req.body;
  if (![username, email, password].every(Boolean)) {
    return res.status(400).json({ error: "All fields are required." });
  }
  try {
    const user = await User.create({ username, email, password: password });
    return res
      .status(201)
      .json({ message: "User registered successfully.", user });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res): Promise<any> => {
  const { username, email, password } = req.body;
  if (![username, email].some(Boolean) || !password) {
    return res
      .status(400)
      .json({ error: "Email or Username and password are required." });
  }

  try {
    const user = await User.findOne({
      where: _.pickBy({ username, email }, Boolean),
    });

    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = jwt.sign(
      { email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.cookie("token", token, { httpOnly: true });

    return res.status(200).json({ message: "Login successful.", token });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
