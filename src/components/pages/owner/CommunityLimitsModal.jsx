import React, {useState} from 'react';
import {FaDumbbell, FaUserGroup} from 'react-icons/fa6';

const CommunityLimitsModal = ({ isOpen, onClose, community, onSave, isSaving }) => {
    const [participantLimit, setParticipantLimit] = useState(community?.participantLimit || 0);
    const [exerciseLimit, setExerciseLimit] = useState(community?.exerciseLimit || 0);
    
    if (!isOpen) return null;
    
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(participantLimit, exerciseLimit);
    };
    
    return (
        <div className="modal modal-open">
            <div className="modal-box max-w-md">
                <h3 className="font-bold text-lg mb-4">Configure Limits for {community.name}</h3>
                
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text flex items-center gap-2">
                                    <FaUserGroup /> 
                                    Participant Limit
                                </span>
                            </label>
                            <div className="input-group">
                                <input
                                    type="number"
                                    min="0"
                                    className="input input-bordered w-full"
                                    value={participantLimit}
                                    onChange={(e) => setParticipantLimit(parseInt(e.target.value) || 0)}
                                    placeholder="0 = unlimited"
                                />
                                <span className="bg-base-100/50 px-4 flex items-center">
                                    {participantLimit === 0 ? '∞' : 'max'}
                                </span>
                            </div>
                            <label className="label">
                                <span className="label-text-alt text-neutral/70">
                                    Current: {community.users.length} participants
                                </span>
                            </label>
                        </div>
                        
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text flex items-center gap-2">
                                    <FaDumbbell />
                                    Exercise Limit
                                </span>
                            </label>
                            <div className="input-group">
                                <input
                                    type="number"
                                    min="0"
                                    className="input input-bordered w-full"
                                    value={exerciseLimit}
                                    onChange={(e) => setExerciseLimit(parseInt(e.target.value) || 0)}
                                    placeholder="0 = unlimited"
                                />
                                <span className="bg-base-100/50 px-4 flex items-center">
                                    {exerciseLimit === 0 ? '∞' : 'max'}
                                </span>
                            </div>
                            <label className="label">
                                <span className="label-text-alt text-neutral/70">
                                    Current: {community.exercises.length} exercises
                                </span>
                            </label>
                        </div>
                        
                        <div className="alert alert-info bg-info/10 border-info/20">
                            <div>
                                <p className="text-sm">
                                    Set to 0 for unlimited participants or exercises
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="modal-action">
                        <button 
                            type="button" 
                            className="btn btn-primary"
                            onClick={onClose}
                            disabled={isSaving}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-primary" 
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <span className="loading loading-spinner"></span>
                            ) : (
                                'Save Limits'
                            )}
                        </button>
                    </div>
                </form>
            </div>
            <div className="modal-backdrop bg-neutral/20" onClick={onClose}></div>
        </div>
    );
};

export default CommunityLimitsModal;
