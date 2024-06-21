async function asyncWrapper<T>(promise: Promise<T>): Promise<[undefined, T] | [Error, undefined]> {
    try {
        const data = await promise;
        return [undefined, data];
    } catch (error) {
        return [error instanceof Error ? error : new Error(String(error)), undefined];
    }
}

export default asyncWrapper;
