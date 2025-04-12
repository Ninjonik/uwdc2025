import React from 'react';
import { FaFilter, FaDumbbell, FaCheck } from 'react-icons/fa6';

const ExerciseManager = ({ allExercises, selectedExerciseIds, onSelectionChange }) => {
    const [searchTerm, setSearchTerm] = React.useState('');
    
    const filteredExercises = allExercises.filter(exercise => 
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <FaDumbbell className="text-primary" />
                    Manage Available Exercises
                </h3>
                
                <div className="relative">
                    <input 
                        type="text"
                        placeholder="Search exercises..."
                        className="input input-bordered w-full md:w-64 pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral/50" />
                </div>
            </div>
            
            <div className="divider"></div>
            
            <p className="text-sm text-neutral/70">
                Select exercises to make them available to your community. These exercises can be assigned as activities.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredExercises.map((exercise) => {
                    const isSelected = selectedExerciseIds.has(exercise.id);
                    return (
                        <div 
                            key={exercise.id}
                            onClick={() => onSelectionChange(exercise.id, !isSelected)}
                            className={`
                                cursor-pointer rounded-xl border p-4 transition-all
                                ${isSelected ? 
                                    'border-primary/50 bg-primary/5' : 
                                    'border-neutral/10 hover:border-neutral/30'
                                }
                            `}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`
                                    p-2 rounded-lg 
                                    ${isSelected ? 'bg-primary text-white' : 'bg-neutral/10'}
                                `}>
                                    {isSelected ? <FaCheck /> : <FaDumbbell />}
                                </div>
                                
                                <div>
                                    <h4 className="font-medium">{exercise.name}</h4>
                                    <p className="text-xs text-neutral/60">
                                        Added {new Date(exercise.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
                
                {filteredExercises.length === 0 && (
                    <div className="col-span-full text-center py-10">
                        <p className="text-neutral/50">No exercises found matching your search</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExerciseManager;
