export interface CreateRequestPayload {
    type?: string;
    description?: string;
    date?: string;
    [key: string]: unknown;
}

export interface ReviewRequestPayload {
    status: 'APPROVED' | 'REJECTED' | 'PENDING';
    comments?: string;
}
