import React from 'react';
import {FaExclamationTriangle} from 'react-icons/fa';

const ConfirmDeleteModal = ({ isOpen, onClose, community, onConfirm, isDeleting }) => {
    if (!isOpen) return null;
    
    return (
        <div className="modal modal-open">
            <div className="modal-box max-w-md">
                <h3 className="font-bold text-lg mb-2">Delete Community</h3>
                
                <div className="alert alert-error mb-4 text-white">
                    <FaExclamationTriangle />
                    <div className={"flex flex-col gap-2 "}>
                        <h3 className="font-bold">Warning: This action cannot be undone!</h3>
                        <p className="text-sm">
                            All data associated with this community will be permanently deleted.
                        </p>
                    </div>
                </div>
                
                <p className="mb-6">
                    Are you sure you want to delete the community 
                    <span className="font-bold"> {community.name}</span>?
                </p>
                
                <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                        <span>Participants:</span>
                        <span className="font-semibold">{community.users.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span>Exercises:</span>
                        <span className="font-semibold">{community.exercises.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span>Admin:</span>
                        <span className="font-semibold">{community.owner.name}</span>
                    </div>
                </div>
                
                <div className="modal-action">
                    <button 
                        type="button" 
                        className="btn btn-primary"
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        Cancel
                    </button>
                    <button 
                        type="button" 
                        className="btn btn-error" 
                        onClick={onConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <span className="loading loading-spinner"></span>
                        ) : (
                            'Delete Community'
                        )}
                    </button>
                </div>
            </div>
            <div className="modal-backdrop bg-neutral/20" onClick={onClose}></div>
        </div>
    );
};

export default ConfirmDeleteModal;
