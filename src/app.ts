import { Application, Request, Response } from "express";
import express from "express";

import { IndexRoutes } from "./app/routes/indexRoutes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import AppError from "./app/errorHelpers/AppError";
import status from "http-status";
import cookieParser from "cookie-parser";

const app: Application = express();

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", IndexRoutes);

// Basic route
app.get("/", (req: Request, res: Response) => {
  throw new AppError(status.BAD_REQUEST, "This is a bad request error");
  res.status(201).json({
    success: true,
    message: "Welcome to the API",
  });
});

// global error
app.use(globalErrorHandler);

// not found
app.use(notFound);

export default app;
