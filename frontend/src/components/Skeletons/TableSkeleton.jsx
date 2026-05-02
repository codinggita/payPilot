import React from 'react';

const TableSkeleton = ({ rows = 6, cols = 5 }) => (
    <div className="animate-pulse">
        <div className="bg-[#1f2020] rounded-2xl border border-white/5 overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-5 gap-4 px-6 py-4 bg-white/5 border-b border-white/10">
                {[...Array(cols)].map((_, i) => (
                    <div key={i} className="h-4 bg-white/5 rounded"></div>
                ))}
            </div>
            {/* Rows */}
            {[...Array(rows)].map((_, i) => (
                <div key={i} className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-white/5">
                    <div className="h-4 bg-white/5 rounded"></div>
                    <div className="h-4 bg-white/5 rounded"></div>
                    <div className="h-4 bg-white/5 rounded w-20"></div>
                    <div className="h-4 bg-white/5 rounded w-16"></div>
                    <div className="h-4 bg-white/5 rounded w-16"></div>
                </div>
            ))}
        </div>
    </div>
);

export default TableSkeleton;
