import {
  Request,
  Response,
  NextFunction
} from "express";

import {
  verifyJwt
} from "../utility/authManager";

export interface AuthRequest
  extends Request {

  user?: any;

}

export const authenticateUser = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): any => {

  try {

    const authHeader =
      req.headers.authorization;

    if (!authHeader) {

      return res.status(401).json({
        success: false,
        message: "Access Token Required"
      });

    }

    const token =
      authHeader.split(" ")[1];

    const decoded =
      verifyJwt(token);

    if (!decoded) {

      return res.status(403).json({
        success: false,
        message: "Invalid Token"
      });

    }

    req.user = decoded;

    next();

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Authentication Failed"
    });

  }

};