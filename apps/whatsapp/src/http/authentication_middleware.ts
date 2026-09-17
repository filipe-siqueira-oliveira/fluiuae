import type { NextFunction, Request, Response } from "express";
import { environment } from "../environment";

export const require_worker_token = (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  const authorization_header = request.headers.authorization ?? "";
  const provided_token = authorization_header.replace("Bearer ", "");

  if (!environment.worker_token || provided_token !== environment.worker_token) {
    response.status(401).json({ error: "invalid_worker_token" });

    return;
  }

  next();
};
