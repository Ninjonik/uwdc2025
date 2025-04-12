import React from 'react';
import { FaUsers } from "react-icons/fa6";

const MembersList = ({ users }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-neutral/5">
      <div className="bg-gradient-to-r from-primary/20 to-primary/5 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary rounded-lg p-2 text-white">
              <FaUsers className="text-xl" />
            </div>
            <h2 className="text-xl font-bold text-neutral">Members</h2>
          </div>
          {users.length > 10 && (
            <button className="text-primary text-sm font-medium flex items-center gap-1">
              View all
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {users.slice(0, 16).map((user) => (
            <div key={user.id} className="flex flex-col items-center group cursor-pointer">
              <div className="relative mb-2 transition-transform transform group-hover:scale-105 duration-200">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <img
                  src={`/avatars/${user.avatar}.svg`}
                  alt={user.name}
                  className="w-16 h-16 rounded-full border-2 border-base-200 shadow-sm object-cover relative z-10"
                />
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-success rounded-full border-2 border-white z-20"></div>
              </div>
              <p className="text-xs font-medium text-center truncate w-full">{user.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MembersList;
