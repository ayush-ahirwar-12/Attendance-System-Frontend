'use client';

import React, { useMemo, useState } from 'react';
import { Search, Users } from 'lucide-react';
import { useGetAllUsers, useUpdateRole} from '@/features/user/hooks/useUserApi';
import type { User } from './users/types';
import UsersTable from './users/UsersTable';
import AssignRoleModal from './users/AssignRoleModal';
import Pagination from './users/Pagination';

/* ─── static fallback roles (populated from API if available) ──────── */
const FALLBACK_ROLES = [
    { _id: '69cb8431824acfbb9c8ace06', name: 'admin', description: 'Manages the admin work' },
    { _id: '69cb847e824acfbb9c8ace0f', name: 'manager', description: 'Manages the admin work' },
    { _id: '69cb844a824acfbb9c8ace09', name: 'teacher', description: 'Class Teacher' },
    { _id: '69cb8458824acfbb9c8ace0c', name: 'student', description: 'Class Student' },
];

const LIMIT = 10;

export default function UsersPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');

    /* ── API ──────────────────────────────────────────────────────────── */
    const { data, isPending, isError } = useGetAllUsers({ page, limit: LIMIT, search });
    const { mutate: assignRoleMutate, isPending: isAssigning } = useUpdateRole();
    console.log(data);
    

    /* ── Derived data ─────────────────────────────────────────────────── */
    const users: User[] = useMemo(() => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (data.data && Array.isArray(data.data)) return data.data;
        return [];
    }, [data]);

    const total: number = data?.total ?? data?.count ?? users.length;
    const totalPages: number = data?.totalPages ?? Math.ceil(total / LIMIT);

    const verifiedCount = users.filter((u) => u.isVerified).length;

    const availableRoles = useMemo(() => {
        const roleMap: Record<string, { _id: string; name: string; description: string }> = {};
        // Start with fallback roles to ensure all roles are always available
        FALLBACK_ROLES.forEach(r => { roleMap[r._id] = r; });
        
        // Add any additional roles found in the users list
        users.forEach((u) => {
            if (u.role?._id) roleMap[u.role._id] = u.role;
        });
        
        return Object.values(roleMap);
    }, [users]);


    /* ── Modal state ──────────────────────────────────────────────────── */
    const [assignTarget, setAssignTarget] = useState<User | null>(null);

    /* ── Handlers ─────────────────────────────────────────────────────── */
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearch(searchInput);
        setPage(1);
    };

    const handleAssignSave = (userId: string, roleId: string) => {
        assignRoleMutate(
            { userId, roleId },
            {
                onSuccess: () => setAssignTarget(null),
            }
        );
    };

    /* ── Loading ──────────────────────────────────────────────────────── */
    if (isPending) {
        return (
            <div className="flex items-center justify-center h-64 gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#b6a0ff]" />
                <span className="text-[#aba9b9] text-sm font-medium tracking-wide">
                    Loading users…
                </span>
            </div>
        );
    }

    /* ── Error ────────────────────────────────────────────────────────── */
    if (isError) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-[#ff716c] text-sm">Failed to load users. Please try again.</p>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-[28px] font-bold text-[#e9e6f7] tracking-tight">Users</h1>
                    <p className="text-sm text-[#aba9b9] mt-1">
                        Manage all users and assign their roles
                    </p>
                </div>
            </div>

            {/* Stats chips */}
            <div className="flex gap-3 mb-5 flex-wrap">
                <div className="bg-[#181826] rounded-lg px-5 py-2.5 flex items-center gap-2.5">
                    <Users size={15} className="text-[#b6a0ff]" />
                    <span className="text-xl font-bold text-[#e9e6f7]">{total}</span>
                    <span className="text-xs text-[#aba9b9]">Total Users</span>
                </div>
                <div className="bg-[#181826] rounded-lg px-5 py-2.5 flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#68fadd] shrink-0" />
                    <span className="text-xl font-bold text-[#e9e6f7]">{verifiedCount}</span>
                    <span className="text-xs text-[#aba9b9]">Verified (this page)</span>
                </div>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex items-center gap-3 mb-5">
                <div className="relative max-w-xs w-full">
                    <Search
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aba9b9] pointer-events-none"
                    />
                    <input
                        className="w-full bg-[#12121e] border border-transparent rounded-lg pl-9 pr-3 py-2.5 text-sm text-[#e9e6f7] placeholder:text-[#aba9b9] focus:outline-none focus:bg-[#1e1e2d] focus:border-[rgba(182,160,255,0.25)] transition-all"
                        placeholder="Search by name or email…"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[#b6a0ff] to-[#7e51ff] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(126,81,255,0.35)] transition-all"
                >
                    Search
                </button>
                {search && (
                    <button
                        type="button"
                        onClick={() => {
                            setSearch('');
                            setSearchInput('');
                            setPage(1);
                        }}
                        className="px-4 py-2.5 rounded-lg text-sm font-semibold text-[#aba9b9] border border-[rgba(71,71,84,0.4)] hover:bg-[#1e1e2d] hover:text-[#e9e6f7] transition-all"
                    >
                        Clear
                    </button>
                )}
            </form>

            {/* Table */}
            <UsersTable users={users} onAssignRole={setAssignTarget} />

            {/* Pagination */}
            {total > 0 && (
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    total={total}
                    limit={LIMIT}
                    onPageChange={setPage}
                />
            )}

            {/* Assign Role Modal */}
            {assignTarget && (
                <AssignRoleModal
                    userName={`${assignTarget.firstName} ${assignTarget.lastName}`}
                    userId={assignTarget._id}
                    currentRoleId={assignTarget.role?._id ?? ''}
                    roles={availableRoles}
                    isLoading={isAssigning}
                    onClose={() => setAssignTarget(null)}
                    onSave={handleAssignSave}
                />
            )}
        </div>
    );
}
