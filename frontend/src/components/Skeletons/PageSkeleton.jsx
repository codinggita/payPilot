import React from 'react';

const PageSkeleton = () => (
    <div className="animate-pulse space-y-6">
        {/* Title */}
        <div className="h-10 bg-white/5 rounded-lg w-64"></div>
        <div className="h-5 bg-white/5 rounded-lg w-96"></div>
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-[#1f2020] rounded-xl p-5 border border-white/5">
                    <div className="h-4 bg-white/5 rounded w-20 mb-4"></div>
                    <div className="h-8 bg-white/5 rounded w-32"></div>
                </div>
            ))}
        </div>
        
        {/* Chart Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <div className="bg-[#1f2020] rounded-xl p-6 border border-white/5 h-80">
                <div className="h-4 bg-white/5 rounded w-32 mb-6"></div>
                <div className="h-52 bg-white/5 rounded"></div>
            </div>
            <div className="bg-[#1f2020] rounded-xl p-6 border border-white/5 h-80">
                <div className="h-4 bg-white/5 rounded w-32 mb-6"></div>
                <div className="h-52 bg-white/5 rounded"></div>
            </div>
        </div>
    </div>
);

export default PageSkeleton;
