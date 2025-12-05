// Custom error classes

export class NetworkError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NetworkError';
    }
}

export class ParseError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ParseError';
    }
}
