class ApiError extends Error {
    constructor(statusCode, stack, message) {
        super(message); // Call the super constructor with the message

        this.statusCode = statusCode;
        this.data = null;
        this.stack = stack;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

module.exports = ApiError;
