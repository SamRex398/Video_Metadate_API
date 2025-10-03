import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface DecodedToken extends JwtPayload {
  role: "user" | "admin";
}

declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}

export const generateToken = async (req: Request, res: Response): Promise<void> => {
  let role: "user" | "admin" = "user";

  // Check if query param "role=admin" was sent
  if (req.query.role === "admin") {
    const authHeader = req.query.token as string;

    if (!authHeader || authHeader !== process.env.ADMIN_TOKEN) {
      res.status(401).json({ message: "Unauthorized to generate admin token" });
      return;
    }
    role = "admin";
  }

  // Sign JWT
  const secret: string = process.env.JWT_SECRET_KEY || "default_secret";
  const token = jwt.sign({ role }, secret, { expiresIn: "1d" });

  res.json({ token });
};

export const authMiddleware = (requiredRole?: "user" | "admin") => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const token = authHeader.split(" ")[1];

    const secret = process.env.JWT_SECRET_KEY;
    if (!secret) {
      throw new Error("JWT_SECRET_KEY is not defined in environment variables");
    }

    try {
      const decoded = jwt.verify(token, secret) as string | JwtPayload;

      if (typeof decoded === "object" && decoded !== null && "role" in decoded) {
        req.user = decoded as DecodedToken;

        if (requiredRole && req.user.role !== requiredRole) {
          res.status(403).json({ message: "Forbidden" });
          return;
        }

        next();
      } else {
        res.status(401).json({ message: "Invalid token payload" });
      }
    } catch (error) {
      res.status(401).json({ message: "Unauthorized" });
    }
  };
};
