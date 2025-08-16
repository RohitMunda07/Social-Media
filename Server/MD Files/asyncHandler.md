export const asyncHandler = async (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
            .catch((err) => {
                next(err)
            })
    }
}

Because you added async before (requestHandler), this function always returns a Promise, not the actual (req, res, next) => {} handler function.