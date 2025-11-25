export class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.status = 404;
    }
}

export class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.status = 400;
    }
}

