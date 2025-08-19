import { apiResponse } from "./responseHandler.js"

class apiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong!!",
        errors = [],
        stack = ''
    ) {
        super(message)
        this.statusCode = statusCode
        this.message = message
        this.errors = errors
        this.data = null
        this.success = false

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
        console.log("Error message in errorHandling", statusCode, this.data, message);

    }
}

export { apiError }