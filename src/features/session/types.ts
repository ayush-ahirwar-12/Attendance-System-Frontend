export interface SessionRecord {
    _id: string;
    student: {
        _id: string;
        name: string;
        email: string;
    };
    status: string
    markedBy: string;
    [key: string]: unknown;
}

export interface SessionResponse {
    sessionId: string;
    message?: string;
    [key: string]: unknown;
}
