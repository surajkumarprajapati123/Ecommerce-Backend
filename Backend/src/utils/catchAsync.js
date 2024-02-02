// const catchAsyn = (fun) => (req, res, next) => {
//     Promise.resolve(fun(req, res, next)).catch((err) => next(err));
// };

// module.exports = catchAsyn;




const catchAsyn = (fun) => async (req, res, next) => {
    try {
        await fun(req, res, next);
    } catch (error) {
        if (error.name === 'ValidationError') {
            // Handle validation errors
            const validationErrors = {};
            for (const field in error.errors) {
                validationErrors[field] = error.errors[field].message;
            }
            res.status(400).json({ error: 'Validation Error', validationErrors });
        } else {
            // Forward other types of errors to the global error handler
            next(error);
        }
    }
};

module.exports = catchAsyn;




