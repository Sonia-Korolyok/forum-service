

export function errorHandler(err, req, res, next) {
    console.error(err); // логируем ошибку для дебага

    // Если в ошибке есть статус, используем его, иначе 500
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    res.status(status).json({ error: message });
}
