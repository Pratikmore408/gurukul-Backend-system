// controllers/authController.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.js";

dotenv.config();

export const register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (user) {
      return res.status(401).send("User already exist try login");
    }
    const newUser = new User({ username, password });
    await newUser.save();

    const userWithoutPassword = await User.findById(newUser._id).select(
      "-password"
    );

    return res.status(201).send(userWithoutPassword);
  } catch (error) {
    return res.status(500).send("Error registering user " + error);
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (user) {
      const token = jwt.sign(
        { _id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(200).json({ token });
    } else {
      res.status(401).send("Error in loggin in");
    }
  } catch (error) {
    return res.status(500).send("Error logging in");
  }
};
