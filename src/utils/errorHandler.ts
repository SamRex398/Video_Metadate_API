import { Request, Response, NextFunction } from 'express';

const httpStatusMessages: Record<number, string> = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    405: "Method Not Allowed",
    409: "Conflict",
    422: "Unprocessable Entity",
    429: "Too Many Requests",
    500: "Internal Server Error",
    502: "Bad Gateway",
    503: "Service Unavailable",
    504: "Gateway Timeout"
};

function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
    const statusCode = err.statusCode || 500;
    const defaultMsg = httpStatusMessages[statusCode] || "Error";

    // Log unexpected errors
    if (!err.statusCode || statusCode === 500) {
        console.error(err.stack || err);
    }

    res.status(statusCode).json({
        success: false,
        message: err.message || defaultMsg
    });
}

export default errorHandler;
