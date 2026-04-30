export interface UserRole {
    _id: string;
    name: string;
    description: string;
}

export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    isVerified: boolean;
    role: UserRole;
}

export interface UsersApiResponse {
    data: User[];
    total: number;
    page: number;
    totalPages: number;
}
