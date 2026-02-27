import status from "http-status";
import z from "zod";
import { TErrorResponse, TErrorSource } from "../interface/error.interface";

export const handleZodError = (err: z.ZodError): TErrorResponse => {
        const statusCode = status.BAD_REQUEST;
         const  message = "Validation error";
         const errorSource : TErrorSource[] = [];
      
          err.issues.forEach((issue: z.ZodIssue) => {
            errorSource.push({
              path: issue.path.join(" => "),
              message: issue.message,
            });
          });
          return {
            success: false,
            message,
            errorSource,
            statusCode,
          };
}