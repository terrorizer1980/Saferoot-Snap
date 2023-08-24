export const HAS_INVALID_PARAMS = (): never => {
    throw new Error('Invalid parameters');
}

export const UNEXPECTED_STATUS_CODE = (): never => {
    throw new Error('Unexpected status code');
}