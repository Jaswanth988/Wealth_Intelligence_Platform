import { Request, Response, NextFunction } from "express";

export const authorizeRoles = (
  ...allowedRoles: string[]
) => {

  return (
    req: any,
    res: Response,
    next: NextFunction
  ) => {

    try {

      const userRole = req.user.role;

      if (
        !allowedRoles.includes(userRole)
      ) {

        return res.status(403).json({
          success: false,
          message: "Access denied"
        });
      }

      next();

    } catch (error) {

      res.status(500).json({
        success: false,
        message: "Authorization failed"
      });
    }
  };
};