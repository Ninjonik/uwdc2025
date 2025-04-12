import React from 'react';
import { FaChartBar } from "react-icons/fa6";

const CommunityStatsCard = ({ userCount, activitiesCount, exercisesCount, createdAt }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-neutral/5">
      <div className="bg-gradient-to-r from-neutral/20 to-neutral/5 p-4">
        <div className="flex items-center gap-3">
          <div className="bg-neutral rounded-lg p-2 text-white">
            <FaChartBar className="text-xl" />
          </div>
          <h2 className="text-xl font-bold text-neutral">Community Stats</h2>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-base-100 p-4 rounded-xl text-center">
            <p className="text-2xl font-bold text-primary">{userCount}</p>
            <p className="text-xs uppercase tracking-wider text-neutral/70 font-medium">Members</p>
          </div>
          
          <div className="bg-base-100 p-4 rounded-xl text-center">
            <p className="text-2xl font-bold text-accent">{activitiesCount}</p>
            <p className="text-xs uppercase tracking-wider text-neutral/70 font-medium">Activities</p>
          </div>
          
          <div className="bg-base-100 p-4 rounded-xl text-center">
            <p className="text-2xl font-bold text-success">{exercisesCount}</p>
            <p className="text-xs uppercase tracking-wider text-neutral/70 font-medium">Exercises</p>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-neutral/10">
          <div className="flex justify-between items-center">
            <span className="text-sm text-neutral/70">Community created</span>
            <span className="text-sm font-medium">{new Date(createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityStatsCard;
