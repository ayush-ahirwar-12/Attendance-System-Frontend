'use client';

import React from 'react';
import { X, ShieldCheck } from 'lucide-react';

interface Role {
    _id: string;
    name: string;
    description: string;
}

interface AssignRoleModalProps {
    userName: string;
    userId: string;
    currentRoleId: string;
    roles: Role[];
    isLoading: boolean;
    onClose: () => void;
    onSave: (userId: string, roleId: string) => void;
}

const inputCls =
    'w-full bg-[#12121e] border border-[rgba(71,71,84,0.3)] rounded-lg px-3 py-2.5 text-sm text-[#e9e6f7] focus:outline-none focus:border-[rgba(182,160,255,0.4)] focus:bg-[#0d0d18] transition-all';
const labelCls =
    'block text-[10px] font-semibold tracking-widest uppercase text-[#aba9b9] mb-1.5';

export default function AssignRoleModal({
    userName,
    userId,
    currentRoleId,
    roles,
    isLoading,
    onClose,
    onSave,
}: AssignRoleModalProps) {
    const [selectedRole, setSelectedRole] = React.useState(currentRoleId);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative w-full max-w-md bg-[#181826] rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.6)] border border-[rgba(182,160,255,0.08)] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[rgba(71,71,84,0.3)]">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[rgba(182,160,255,0.12)]">
                            <ShieldCheck size={18} className="text-[#b6a0ff]" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-[#e9e6f7]">
                                Assign Role
                            </h2>
                            <p className="text-xs text-[#aba9b9] mt-0.5">
                                For <span className="text-[#b6a0ff] font-medium">{userName}</span>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1e1e2d] text-[#aba9b9] hover:text-[#e9e6f7] transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5">
                    <div>
                        <label className={labelCls}>Select Role</label>
                        <select
                            className={inputCls}
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                        >
                            <option value="">— Select a Role —</option>
                            {roles.map((role) => (
                                <option key={role._id} value={role._id}>
                                    {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                                    {role.description ? ` – ${role.description}` : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                    {selectedRole && (
                        <p className="mt-3 text-xs text-[#aba9b9]">
                            Selected:{' '}
                            <span className="text-[#b6a0ff] font-semibold">
                                {roles.find((r) => r._id === selectedRole)?.name}
                            </span>
                        </p>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-[#aba9b9] border border-[rgba(71,71,84,0.4)] hover:bg-[#1e1e2d] hover:text-[#e9e6f7] transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSave(userId, selectedRole)}
                        disabled={!selectedRole || isLoading}
                        className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[#b6a0ff] to-[#7e51ff] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(126,81,255,0.35)] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                    >
                        {isLoading ? 'Saving…' : 'Save Role'}
                    </button>
                </div>
            </div>
        </div>
    );
}
