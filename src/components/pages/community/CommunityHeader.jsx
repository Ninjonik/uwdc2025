import React from 'react';
import {FaUsers} from "react-icons/fa6";
import Link from 'next/link';
import {FaCog} from "react-icons/fa";

const CommunityHeader = ({ name, avatar, userCount, communityId, adminSlug, isAdmin }) => {
  return (
    <div className="relative rounded-2xl bg-gradient-to-br from-primary/90 to-primary/70 p-8 text-white shadow-xl overflow-hidden">
      <div className="absolute inset-0 bg-pattern opacity-10"></div>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-white/10 blur-md"></div>
          <img 
            src={`/avatars/${avatar}.svg`} 
            alt={`${name} avatar`} 
            className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white/20 relative z-10 object-cover" 
          />
        </div>
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-3xl font-extrabold">{name}</h1>
          <div className="flex items-center justify-center md:justify-start gap-2 text-white/80">
            <FaUsers />
            <span>{userCount} members</span>
          </div>
        </div>
        
        {isAdmin && (
          <div className="absolute top-4 right-4">
            <Link 
              href={`/${adminSlug}`}
              className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-all flex items-center justify-center tooltip" 
              data-tip="Admin Settings"
            >
              <FaCog className="text-xl" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityHeader;
