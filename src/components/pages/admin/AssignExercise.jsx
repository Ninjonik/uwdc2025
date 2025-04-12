import React, {useState} from 'react';
import {FaPlay} from 'react-icons/fa6';
import {FaInfoCircle} from "react-icons/fa";

const AssignExercise = ({ exercises, onAssign, saving }) => {
    const [selectedExerciseId, setSelectedExerciseId] = useState(exercises[0]?.id || '');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedExerciseId) {
            onAssign(selectedExerciseId);
        }
    };
    
    if (exercises.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-neutral/70">
                    No exercises available. Please add exercises in the "Manage Exercises" tab first.
                </p>
            </div>
        );
    }
    
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <FaPlay className="text-accent" />
                <h3 className="text-xl font-bold">Assign New Activity</h3>
            </div>
            
            <div className="alert alert-info bg-info/10 border-info/20">
                <FaInfoCircle className="text-info" />
                <div>
                    <h4 className="font-bold">This will replace the current activity!</h4>
                    <p className="text-sm">
                        Assigning a new exercise will end the current activity and start a new one.
                        All members will be notified of the change.
                    </p>
                </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-medium">Select exercise to assign</span>
                    </label>
                    <select 
                        className="select select-bordered w-full" 
                        value={selectedExerciseId}
                        onChange={(e) => setSelectedExerciseId(e.target.value)}
                        name="exerciseId"
                        required
                    >
                        {exercises.map(exercise => (
                            <option key={exercise.id} value={exercise.id}>
                                {exercise.name}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div className="flex justify-end">
                    <button 
                        type="submit"
                        className="btn btn-accent"
                        disabled={saving || !selectedExerciseId}
                    >
                        {saving ? (
                            <span className="loading loading-spinner"></span>
                        ) : (
                            <>
                                <FaPlay className="mr-2" />
                                Assign New Activity
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AssignExercise;
