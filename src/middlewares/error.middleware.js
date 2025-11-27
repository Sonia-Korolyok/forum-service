
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    const contains = err.message.includes('not found');

    if (err.message && contains) {
        return res.status(400).json({
            status: 'not found',
            message: err.message,
            code: 404,
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



