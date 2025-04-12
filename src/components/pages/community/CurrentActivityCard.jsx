"use client"

import React, {useEffect, useState} from 'react';
import {MdArrowForward, MdCheck, MdClose, MdOutlineAccessTime} from "react-icons/md";
import {formatTimeDifference} from '@/utils/formatters';
import ActivityCompletionForm from './ActivityCompletionForm';

const CurrentActivityCard = ({ currentActivity, isCompleted }) => {
  const [completed, setCompleted] = useState(isCompleted);
  const [showCompletionForm, setShowCompletionForm] = useState(false);

  const handleShowCompletionForm = () => {
    setShowCompletionForm(true);
  };

  const handleCompletionSubmit = () => {
    setCompleted(true);
    setShowCompletionForm(false);
  };

  useEffect(() => {
    setCompleted(isCompleted) 
  }, [isCompleted]);
  
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-neutral/5 transition-all hoy ver:shadow-xl">
      <div className="bg-gradient-to-r from-accent/20 to-accent/5 p-4">
        <div className="flex items-center gap-3">
          <div className="bg-accent rounded-lg p-2 text-white">
            <MdOutlineAccessTime className="text-xl" />
          </div>
          <h2 className="text-xl font-bold text-neutral">
            {currentActivity ? "Current Activity" : "No Current Activity"}
          </h2>
        </div>
      </div>
      
      <div className="p-6">
        {currentActivity ? (
          <>
            <p className="text-lg flex justify-start font-medium mb-2">{currentActivity.exercise.name}</p>
            <div className="flex items-center text-sm text-neutral/70 mb-6">
              <MdOutlineAccessTime className="w-5 h-5 mr-2" />
              <span>{formatTimeDifference(currentActivity.createdAt)}</span>
            </div>
            
            {showCompletionForm ? (
              <ActivityCompletionForm 
                onSubmit={handleCompletionSubmit} 
                onCancel={() => setShowCompletionForm(false)}
                activityId={currentActivity.id}
              />
            ) : completed ? (
              <div className="flex flex-col items-center py-4 bg-success/10 rounded-xl">
                <div className="bg-success rounded-full p-2 mb-2 text-white">
                  <MdCheck className="w-6 h-6" />
                </div>
                <p className="font-medium text-success">Marked as completed!</p>
              </div>
            ) : (
              <button 
                onClick={handleShowCompletionForm}
                className="btn btn-primary w-full gap-2"
              >
                Mark as Done
                <MdArrowForward className="w-5 h-5" />
              </button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="bg-error/10 p-3 rounded-full mb-3">
              <MdClose className="w-6 h-6 text-error" />
            </div>
            <p className="text-error font-medium">No ongoing activities</p>
            <p className="text-neutral/60 text-sm mt-2">Check back later or create one</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentActivityCard;
