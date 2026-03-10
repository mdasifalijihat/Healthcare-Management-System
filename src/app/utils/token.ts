import { JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtUtils } from "./jwt";
import { envVars } from "../../config/env";
import AppError from "../errorHelpers/AppError";
import status from "http-status";
import { cookieUtils } from "./cookie";
import { Response } from "express";

const ONE_DAY = 1000 * 60 * 60 * 24;
const SEVEN_DAYS = ONE_DAY * 7;

// add functions to generate access and refresh tokens using jwtUtils and env variables
const getAccessToken = (payload: JwtPayload): string => {
  if (!envVars.ACCESS_TOKEN_SECRET) {
    throw new Error("ACCESS_TOKEN_SECRET is not defined");
  }

  const accessToken = jwtUtils.createToken(
    payload,
    envVars.ACCESS_TOKEN_SECRET,
    {
      expiresIn: envVars.ACCESS_TOKEN_EXPIRATION,
    } as SignOptions,
  );

  return accessToken;
};

// TODO: add function to generate refresh token
const getRefreshToken = (payload: JwtPayload): string => {
  if (!envVars.REFRESH_TOKEN_SECRET) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "REFRESH_TOKEN_SECRET is not defined",
    );
  }

  const refreshToken = jwtUtils.createToken(
    payload,
    envVars.REFRESH_TOKEN_SECRET,
    {
      expiresIn: envVars.REFRESH_TOKEN_EXPIRATION,
    } as SignOptions,
  );

  return refreshToken;
};

// set up tokenUtils object to export the functions
const setAccessTokenCookie = (res: Response, token: string) => {
  cookieUtils.setCookie(res, "accessToken", token, {
    httpOnly: true,
    // secure: true,
    // sameSite: "none",
    secure: process.env.NODE_ENV === "production", // localhost/dev এ false
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: ONE_DAY, // 24 hours in seconds
  });
};

// const setRefreshTokenCookie = (res: Response, token: string) => {
const setRefreshTokenCookie = (res: Response, token: string) => {
  cookieUtils.setCookie(res, "refreshToken", token, {
    httpOnly: true,
    // secure: true,
    // sameSite: "none",
    secure: process.env.NODE_ENV === "production", // localhost/dev এ false
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: SEVEN_DAYS, // 7 days in seconds
  });
};

const setBetterAuthSessionCookie = (res: Response, token: string) => {
  cookieUtils.setCookie(res, "betterAuthSession", token, {
    httpOnly: true,
    // secure: true,
    // sameSite: "none",
    secure: process.env.NODE_ENV === "production", // localhost/dev এ false
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: ONE_DAY, // 1 day
  });
};

export const tokenUtils = {
  getAccessToken,
  getRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setBetterAuthSessionCookie,
};
