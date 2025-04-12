"use client";

import React, {useState, useTransition} from 'react';
import PageBase from '@/components/pages/PageBase';
import {FaCheck, FaChevronLeft} from 'react-icons/fa6';
import Link from 'next/link';
import ExerciseManager from '@/components/pages/admin/ExerciseManager';
import AssignExercise from '@/components/pages/admin/AssignExercise';
import fireToast from "@/utils/fireToast";
import {FaSave} from "react-icons/fa";
import {assignNewActivityAction, updateCommunityExercisesAction} from '@/actions/adminActions';

const AdminPage = ({ community, allExercises, loggedInUser }) => {
    const [isPending, startTransition] = useTransition();
    const [success, setSuccess] = useState(false);
    const [currentTab, setCurrentTab] = useState('manage'); // 'manage' or 'assign'
    
    // Create sets of IDs for easier manipulation
    const communityExerciseIds = new Set(community.exercises.map(ex => ex.id));
    const [selectedExerciseIds, setSelectedExerciseIds] = useState(communityExerciseIds);
    
    const handleExerciseSelection = (exerciseId, isSelected) => {
        const newSelection = new Set(selectedExerciseIds);
        
        if (isSelected) {
            newSelection.add(exerciseId);
        } else {
            newSelection.delete(exerciseId);
        }
        
        setSelectedExerciseIds(newSelection);
    };
    
    const handleSaveExercises = async () => {
        startTransition(async () => {
            try {
                const result = await updateCommunityExercisesAction(
                    community.id, 
                    Array.from(selectedExerciseIds)
                );
                
                if (result.type === 'success') {
                    setSuccess(true);
                    fireToast('success', 'Exercises updated successfully!');
                    
                    setTimeout(() => {
                        setSuccess(false);
                    }, 3000);
                } else {
                    fireToast('error', result.message || 'Failed to update exercises');
                }
            } catch (error) {
                fireToast('error', 'Failed to update exercises');
                console.error(error);
            }
        });
    };
    
    const handleAssignExercise = async (exerciseId) => {
        startTransition(async () => {
            try {
                const result = await assignNewActivityAction(community.id, exerciseId);
                
                if (result.type === 'success') {
                    fireToast('success', 'New exercise assigned successfully!');
                } else {
                    fireToast('error', result.message || 'Failed to assign exercise');
                }
            } catch (error) {
                fireToast('error', 'Failed to assign exercise');
                console.error(error);
            }
        });
    };
    
    return (
        <PageBase>
            <div className="px-4 py-6 md:p-8 space-y-6 max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <Link 
                            href={`/${community.id}`} 
                            className="btn btn-circle btn-primary"
                        >
                            <FaChevronLeft />
                        </Link>
                        <h1 className="text-3xl font-bold">
                            Admin - {community.name}
                        </h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <img 
                            src={`/avatars/${community.owner.avatar}.svg`} 
                            alt={community.owner.name} 
                            className="h-8 w-8 rounded-full" 
                        />
                        <span>Admin: {community.owner.name}</span>
                    </div>
                </div>
                
                {/* Tabs */}
                <div className="tabs tabs-boxed bg-base-100 border border-primary p-1 rounded-md">
                    <button 
                        className={`tab ${currentTab === 'manage' ? 'tab-active' : ''}`}
                        onClick={() => setCurrentTab('manage')}
                    >
                        Manage Exercises
                    </button>
                    <button 
                        className={`tab ${currentTab === 'assign' ? 'tab-active' : ''}`}
                        onClick={() => setCurrentTab('assign')}
                    >
                        Assign New Exercise
                    </button>
                </div>
                
                {/* Tab Content */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                    {currentTab === 'manage' ? (
                        <>
                            <ExerciseManager 
                                allExercises={allExercises}
                                selectedExerciseIds={selectedExerciseIds}
                                onSelectionChange={handleExerciseSelection}
                            />
                            
                            <div className="flex justify-end mt-6">
                                <button 
                                    className={`btn ${success ? 'btn-success' : 'btn-primary'}`}
                                    onClick={handleSaveExercises}
                                    disabled={isPending}
                                >
                                    {isPending ? (
                                        <span className="loading loading-spinner"></span>
                                    ) : success ? (
                                        <FaCheck />
                                    ) : (
                                        <FaSave className="mr-2" />
                                    )}
                                    {success ? 'Saved!' : 'Save Exercises'}
                                </button>
                            </div>
                        </>
                    ) : (
                        <AssignExercise 
                            exercises={community.exercises}
                            onAssign={handleAssignExercise}
                            saving={isPending}
                        />
                    )}
                </div>
            </div>
        </PageBase>
    );
};

export default AdminPage;
