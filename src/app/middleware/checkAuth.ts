import { NextFunction, Request, Response } from "express";
import { Role, UserStatus } from "../../generated/prisma/enums";
import { cookieUtils } from "../utils/cookie";
import { prisma } from "../lib/prisma";
import AppError from "../errorHelpers/AppError";
import status from "http-status";
import { jwtUtils } from "../utils/jwt";
import { envVars } from "../../config/env";

export const checkAuth =
  (...authRoles: Role[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // session token verification
      const sessionToken = cookieUtils.getCookie(req, "betterAuthSession");

      if (!sessionToken) {
        throw new Error("Unauthorized: No session token provided");
      }

      if (sessionToken) {
        const sessionExists = await prisma.session.findFirst({
          where: {
            token: sessionToken,
            expiresAt: {
              gt: new Date(),
            },
          },
          include: {
            user: true,
          },
        });
        if (sessionExists && sessionExists.user) {
          const user = sessionExists.user;

          const now = new Date();
          const expiresAt = new Date(sessionExists.expiresAt);
          const createdAt = new Date(sessionExists.createdAt);
          const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
          const timeRemaining = expiresAt.getTime() - now.getTime();
          const percentRemaining = (timeRemaining / sessionLifeTime) * 100;

          if (percentRemaining < 20) {
            res.setHeader("x-refresh-token", "true");
            res.setHeader("x-session-Expires-At", expiresAt.toISOString());
            res.setHeader("x-time-remaining", timeRemaining.toString());

            console.log("session expiring soon!!");
          }
          if (
            user.status === UserStatus.DELETED ||
            user.status === UserStatus.BLOCKED
          ) {
            throw new AppError(
              status.UNAUTHORIZED,
              "Unauthorized: User is blocked or deleted",
            );
          }
          if (user.isDeleted) {
            throw new AppError(
              status.UNAUTHORIZED,
              "Unauthorized: User is blocked or deleted",
            );
          }
          if (authRoles.length > 0 && !authRoles.includes(user.role)) {
            throw new AppError(
              status.FORBIDDEN,
              "Forbidden: You don't have permission to access this resource",
            );
          }
          req.user = {
            userId: user.id,
            role: user.role,
            email: user.email,
          };
        }
      }

      // access token verification
      const accessToken = cookieUtils.getCookie(req, "accessToken");

      if (!accessToken) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized: No access token provided",
        );
      }
      const verifiedToken = jwtUtils.verifyToken(
        accessToken,
        envVars.ACCESS_TOKEN_SECRET,
      );

      if (!verifiedToken.success) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized: Invalid access token",
        );
      }

      if (
        authRoles.length > 0 &&
        verifiedToken.data &&
        !authRoles.includes(
          (verifiedToken.data as unknown as { role: Role }).role,
        )
      ) {
        throw new AppError(
          status.FORBIDDEN,
          "Forbidden: You don't have permission to access this resource",
        );
      }

      next();
    } catch (err) {
      next(err);
    }
  };
