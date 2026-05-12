export interface ManualMarkPayload {
    studentId: string;
    status: 'PRESENT' | 'ABSENT' | 'LATE';
    remarks?: string;
    [key: string]: unknown;
}

export interface OverrideRecordPayload {
    status: 'PRESENT' | 'ABSENT' | 'LATE';
    reason?: string;
    [key: string]: unknown;
}

export interface MarkAttendancePayload {
    sessionId?: string;
    studentId?: string;
    [key: string]: unknown;
}
