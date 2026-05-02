import React from 'react';

const CardSkeleton = ({ count = 3 }) => (
    <div className="animate-pulse grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(count)].map((_, i) => (
            <div key={i} className="bg-[#1f2020] rounded-xl p-5 border border-white/5">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-white/5 rounded-xl"></div>
                    <div>
                        <div className="h-4 bg-white/5 rounded w-24 mb-2"></div>
                        <div className="h-3 bg-white/5 rounded w-16"></div>
                    </div>
                </div>
                <div className="h-6 bg-white/5 rounded w-20 mb-3"></div>
                <div className="h-4 bg-white/5 rounded w-32"></div>
            </div>
        ))}
    </div>
);

export default CardSkeleton;
