'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({
    page,
    totalPages,
    total,
    limit,
    onPageChange,
}: PaginationProps) {
    const from = (page - 1) * limit + 1;
    const to = Math.min(page * limit, total);

    return (
        <div className="flex items-center justify-between mt-4 px-1">
            <span className="text-xs text-[#aba9b9]">
                Showing{' '}
                <span className="text-[#e9e6f7] font-semibold">{from}–{to}</span> of{' '}
                <span className="text-[#e9e6f7] font-semibold">{total}</span> users
            </span>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#aba9b9] border border-[rgba(71,71,84,0.4)] hover:bg-[#1e1e2d] hover:text-[#e9e6f7] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <ChevronLeft size={14} /> Previous
                </button>
                <span className="text-xs text-[#aba9b9] px-1">
                    Page{' '}
                    <span className="text-[#b6a0ff] font-bold">{page}</span>{' '}
                    of {totalPages}
                </span>
                <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#aba9b9] border border-[rgba(71,71,84,0.4)] hover:bg-[#1e1e2d] hover:text-[#e9e6f7] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    Next <ChevronRight size={14} />
                </button>
            </div>
        </div>
    );
}
