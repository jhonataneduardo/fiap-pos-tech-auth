export interface UseCaseInterface<TRequest, TResponse> {
    execute(request?: TRequest): Promise<TResponse> | TResponse;
}
