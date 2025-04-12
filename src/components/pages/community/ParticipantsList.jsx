import React from 'react';
import {FaClock, FaDumbbell, FaFire, FaMedal} from "react-icons/fa6";

const ParticipantsList = ({ participants, activityStartTime }) => {

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-neutral/5">
      <div className="bg-gradient-to-r from-success/20 to-success/5 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-success rounded-lg p-2 text-white">
              <FaMedal className="text-xl" />
            </div>
            <h2 className="text-xl font-bold text-neutral">Participants</h2>
          </div>
          <span className="badge badge-success">{participants.length} completed</span>
        </div>
      </div>
      
      <div className="p-6">
        {participants.length > 0 ? (
          <div className="space-y-4">
            {/* Column Headers */}
            <div className="hidden md:grid md:grid-cols-4 items-center px-4 text-xs font-semibold text-neutral/70 uppercase tracking-wider">
              <div className="col-span-1">Participant</div>
              <div className="col-span-1 text-center">Time</div>
              <div className="col-span-1 text-center">Reaction</div>
              <div className="col-span-1 text-center">Reps</div>
            </div>
            
            {participants.map((participant, index) => {
              const completedAtDate = new Date(participant.createdAt);

              return (
                <div 
                  key={participant.id || index} 
                  className={`p-4 rounded-xl ${
                    index === 0 ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200' : 'bg-base-100'
                  }`}
                >
                  <div className="md:hidden space-y-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={`/avatars/${participant.user?.avatar}.svg`}
                        alt={participant.user?.name}
                        className="w-12 h-12 rounded-full border-2 border-base-200 object-cover"
                      />
                      <div>
                        <div className="font-medium">{participant.user?.name}</div>
                        <div className="text-xs text-neutral/70">
                          {completedAtDate.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-base-100/50 border border-primary rounded-lg p-2">
                        <div className="flex justify-center text-neutral/60 mb-1">
                          <FaClock className="text-xs" />
                        </div>
                        <div className="text-sm font-medium">
                          {completedAtDate.toLocaleTimeString()}
                        </div>
                      </div>
                      
                      <div className="bg-base-100/50 border border-primary rounded-lg p-2">
                        <div className="flex justify-center text-neutral/60 mb-1">
                          <FaFire className="text-xs" />
                        </div>
                        <div className="text-sm font-medium text-accent">
                            {participant.reaction} s
                        </div>
                      </div>
                      
                      <div className="bg-base-100/50 border border-primary rounded-lg p-2">
                        <div className="flex justify-center text-neutral/60 mb-1">
                          <FaDumbbell className="text-xs" />
                        </div>
                        <div className="text-sm font-medium text-primary">
                          {participant.reps > 0 ? participant.reps : '-'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="hidden md:grid md:grid-cols-4 items-center">
                    <div className="col-span-1 flex items-center gap-3">
                      <img
                        src={`/avatars/${participant.user?.avatar}.svg`}
                        alt={participant.user?.name}
                        className="w-10 h-10 rounded-full border-2 border-base-200 object-cover"
                      />
                      <div className="font-medium">{participant.user?.name}</div>
                    </div>
                    
                    <div className="col-span-1 text-center">
                      <span className="text-sm">{completedAtDate.toLocaleTimeString()}</span>
                    </div>
                    
                    <div className="col-span-1 text-center">
                      <span className="text-sm font-semibold text-accent">
                        {participant.reaction} s
                      </span>
                    </div>
                    
                    <div className="col-span-1 text-center">
                      <span className="text-sm font-semibold text-primary">
                        {participant.reps > 0 ? participant.reps : '-'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="bg-neutral/10 p-3 rounded-full mb-3">
              <FaFire className="w-6 h-6 text-neutral/50" />
            </div>
            <p className="font-medium text-neutral/70">No participants yet</p>
            <p className="text-neutral/60 text-sm mt-2">Be the first to complete!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipantsList;
