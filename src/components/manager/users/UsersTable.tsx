'use client';

import React from 'react';
import { ShieldCheck, CheckCircle2, XCircle, GraduationCap } from 'lucide-react';
import type { User } from './types';

/* ── Role badge colors ────────────────────────────────────────────── */
const ROLE_COLORS: Record<string, { text: string; bg: string }> = {
    manager:   { text: '#b6a0ff', bg: 'rgba(182,160,255,0.1)' },
    admin:     { text: '#b6a0ff', bg: 'rgba(182,160,255,0.1)' },
    teacher:   { text: '#ff716c', bg: 'rgba(255,113,108,0.1)' },
    student:   { text: '#68fadd', bg: 'rgba(104,250,221,0.1)' },
};

const getRoleColor = (roleName: string) =>
    ROLE_COLORS[roleName?.toLowerCase()] ?? { text: '#aba9b9', bg: 'rgba(171,169,185,0.1)' };

/* ── Avatar ───────────────────────────────────────────────────────── */
function Avatar({ firstName, lastName }: { firstName: string; lastName: string }) {
    const initials = `${firstName?.charAt(0) ?? ''}${lastName?.charAt(0) ?? ''}`.toUpperCase();
    return (
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7e51ff] to-[#56ebcf] flex items-center justify-center text-[11px] font-bold text-white shrink-0 border-2 border-[rgba(182,160,255,0.2)]">
            {initials}
        </div>
    );
}

/* ── UsersTable ───────────────────────────────────────────────────── */
interface UsersTableProps {
    users: User[];
    onAssignRole: (user: User) => void;
    onEnroll: (user: User) => void;
}

export default function UsersTable({ users, onAssignRole, onEnroll }: UsersTableProps) {
    if (users.length === 0) {
        return (
            <div className="bg-[#181826] rounded-xl p-12 text-center">
                <p className="text-[#aba9b9] text-sm">No users match your search.</p>
            </div>
        );
    }

    return (
        <div className="bg-[#181826] rounded-xl p-6 overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-1 min-w-[720px]">
                <thead>
                    <tr>
                        {['Name', 'Email', 'Phone Number', 'Role', 'Verified', 'Actions'].map((h) => (
                            <th
                                key={h}
                                className="text-left text-[11px] font-semibold tracking-[0.06em] uppercase text-[#aba9b9] px-3 py-2.5"
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => {
                        const roleColor = getRoleColor(user.role?.name ?? '');
                        return (
                            <tr
                                key={user._id}
                                className="bg-[#12121e] hover:bg-[#1e1e2d] transition-colors group"
                            >
                                {/* Name */}
                                <td className="px-3 py-3 rounded-l-lg">
                                    <div className="flex items-center gap-3">
                                        <Avatar firstName={user.firstName} lastName={user.lastName} />
                                        <div>
                                            <div className="text-[13px] font-semibold text-[#e9e6f7]">
                                                {user.firstName} {user.lastName}
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                {/* Email */}
                                <td className="px-3 py-3 text-[13px] text-[#aba9b9]">
                                    {user.email}
                                </td>

                                {/* Phone */}
                                <td className="px-3 py-3 text-[13px] text-[#aba9b9]">
                                    {user.phoneNumber || '—'}
                                </td>

                                {/* Role */}
                                <td className="px-3 py-3">
                                    <span
                                        className="text-xs font-semibold px-2.5 py-1 rounded-full"
                                        style={{ color: roleColor.text, background: roleColor.bg }}
                                    >
                                        {user.role?.name
                                            ? user.role.name.charAt(0).toUpperCase() + user.role.name.slice(1)
                                            : 'Unassigned'}
                                    </span>
                                </td>

                                {/* Verified */}
                                <td className="px-3 py-3">
                                    {user.isVerified ? (
                                        <span className="flex items-center gap-1.5 text-xs font-semibold text-[#68fadd]">
                                            <CheckCircle2 size={13} />
                                            Verified
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1.5 text-xs font-semibold text-[#ff716c]">
                                            <XCircle size={13} />
                                            Pending
                                        </span>
                                    )}
                                </td>

                                {/* Actions */}
                                <td className="px-3 py-3 rounded-r-lg">
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            onClick={() => onAssignRole(user)}
                                            title="Assign Role"
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[rgba(104,250,221,0.08)] text-[#68fadd] text-xs font-semibold hover:bg-[rgba(104,250,221,0.15)] hover:scale-105 transition-all"
                                        >
                                            <ShieldCheck size={13} />
                                            Assign Role
                                        </button>
                                        {user.role?.name?.toLowerCase() === 'student' && (
                                            <button
                                                onClick={() => onEnroll(user)}
                                                title="Enroll in Class"
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[rgba(182,160,255,0.08)] text-[#b6a0ff] text-xs font-semibold hover:bg-[rgba(182,160,255,0.15)] hover:scale-105 transition-all"
                                            >
                                                <GraduationCap size={13} />
                                                Enroll
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
