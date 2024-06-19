class AppError extends Error {
    status: number;

    constructor(message: string, status = 500) {
        super(message);
        this.status = status;
    }
}

export default AppError;
