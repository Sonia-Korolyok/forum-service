
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    if (err.message && err.message.includes('not found')) {
        return res.status(400).json({
            status: 'not found',
            message: err.message,
            code: 404,
            path: req.path
        });
    }
    if (err.message && err.message.includes('User account already exists')) {
        return res.status(400).json({
            status: 'Conflict',
            message: err.message,
            code: 409,
            path: req.path
        });
    }

    return res.status(500).json({
        status: 'Internal server error',
        code: 500,
        message: err.message,
        path: req.path
    })
}
export default errorHandler;



