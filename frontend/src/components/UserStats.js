import React from 'react';

const UserStats = ({ user }) => {
    const waterProgress = (user?.takenWater || 0) / ((user?.daily_water_intake || 2) * 1000) * 100;
    const pointsProgress = Math.min((user?.points || 0) / 200 * 100, 100);

    return (
        <div className="bg-[#EFEDE6] p-4 rounded-lg shadow-lg z-10 flex items-center gap-6">
            <img
                src="/default-avatar.png"
                alt="Profile"
                className="w-16 h-16 rounded-full border-2 border-white shadow-lg"
            />
            <div className="flex-1 min-w-[200px]">
                <div className="mb-2">
                    <div className="flex justify-between mb-1">
                        <span>Points: {user?.points || 0}</span>
                    </div>
                    <div className="bg-[#FAF9F3] h-2 rounded-full">
                        <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${pointsProgress}%` }}
                        ></div>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between mb-1">
                        <span>Water: {(user?.takenWater || 0)/1000}L / {user?.daily_water_intake || 2}L</span>
                    </div>
                    <div className="bg-[#FAF9F3] h-2 rounded-full">
                        <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(waterProgress, 100)}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserStats;
