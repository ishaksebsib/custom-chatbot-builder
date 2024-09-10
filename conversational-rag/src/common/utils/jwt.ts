import { env } from "./envConfig";
import jwt from "jsonwebtoken";

const verifyToken = (token: string) => {
  return jwt.verify(token, env.JWT_ACCESS_TOKEN_SECRET);
};

export { verifyToken };
