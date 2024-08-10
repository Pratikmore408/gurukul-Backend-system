import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization");
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).send("Provide Valid Token");
      }

      req.user = user;

      next();
    });
  } else {
    res.status(401).send("Provide Valid Token");
  }
};
