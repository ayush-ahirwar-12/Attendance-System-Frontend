export interface Semester {
    _id: string;
    name: string;
    startDate: string | Date;
    endDate: string | Date;
    status: 'active' | 'upcoming' | 'completed';
}

export interface CreateSemesterPayload {
    name: string;
    startDate: string;
    endDate: string;
    [key: string]: unknown;
}

export interface UpdateSemesterStatusPayload {
    id: string;
    status: 'active' | 'upcoming' | 'completed';
}
