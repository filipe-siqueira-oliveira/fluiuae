export class HttpError extends Error {
  public readonly status_code: number;
  public readonly details?: unknown;

  constructor(status_code: number, message: string, details?: unknown) {
    super(message);
    this.name = "HttpError";
    this.status_code = status_code;
    this.details = details;
  }
}

export const bad_request = (message: string, details?: unknown) =>
  new HttpError(400, message, details);

export const unauthorized = (message = "unauthorized") => new HttpError(401, message);

export const forbidden = (message = "forbidden") => new HttpError(403, message);

export const not_found = (message = "not_found") => new HttpError(404, message);

export const conflict = (message: string) => new HttpError(409, message);
