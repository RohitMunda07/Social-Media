export const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
            .catch((err) => {
                next(err)
            })
    }
}




// const asyncHandler = async (fn) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(error.status || 500).json({
//             success: false,
//             message: error.message || 'Something went wrong'
//         })
//     }
// }

// export {
//     asyncHandler
// }