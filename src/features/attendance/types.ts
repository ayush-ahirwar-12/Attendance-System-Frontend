export interface ManualMarkPayload {
    studentId: string;
    status: string
    remarks?: string;
    [key: string]: unknown;
}

export interface OverrideRecordPayload {
    status: 'PRESENT' | 'ABSENT' | 'LATE';
    reason?: string;
    [key: string]: unknown;
}

export interface MarkAttendancePayload {
    qrToken?: string;
    sessionId?: string;
    studentId?: string;
    latitude?: number;
    longitude?: number;
    faceImage?: string;
    [key: string]: unknown;
}
