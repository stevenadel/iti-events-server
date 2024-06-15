async function asyncWrapper<T>(promise: Promise<T>): Promise<[undefined, T] | Error> {
    try {
        const data = await promise;
        return [undefined, data];
    } catch (error) {
        return error as Error;
    }
}

export default asyncWrapper;
