import { apiResponse } from "../utils/responseHandler.js";

const errorMiddleware = (err, req, res, next) => {
    console.error("Error Middleware: ", err.message);

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json(
        new apiResponse(statusCode, null, err.message)
    )
}

export {
    errorMiddleware
}