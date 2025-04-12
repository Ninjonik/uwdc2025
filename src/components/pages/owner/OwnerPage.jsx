"use client";

import React, {useState, useTransition} from 'react';
import PageBase from '@/components/pages/PageBase';
import {FaBuildingUser, FaCircleInfo, FaDumbbell, FaGear, FaUserGroup} from 'react-icons/fa6';
import CommunityListItem from '@/components/pages/owner/CommunityListItem';
import CommunityLimitsModal from '@/components/pages/owner/CommunityLimitsModal';
import ConfirmDeleteModal from '@/components/pages/owner/ConfirmDeleteModal';
import {getAllCommunitiesAction, removeCommunityAction, updateCommunityLimitsAction} from '@/actions/ownerActions';
import fireToast from "@/utils/fireToast";

const OwnerPage = ({ communities: initialCommunities, user }) => {
    const [communities, setCommunities] = useState(initialCommunities);
    const [isPending, startTransition] = useTransition();
    const [selectedCommunity, setSelectedCommunity] = useState(null);
    const [isLimitsModalOpen, setIsLimitsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    const filteredCommunities = communities.filter(community => 
        community.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const refreshCommunities = () => {
        startTransition(async () => {
            const result = await getAllCommunitiesAction();
            if (result.type === 'success') {
                setCommunities(result.data);
            } else {
                fireToast('error', 'Failed to refresh communities');
            }
        });
    };
    
    const handleUpdateLimits = (participantLimit, exerciseLimit) => {
        startTransition(async () => {
            const result = await updateCommunityLimitsAction(
                selectedCommunity.id,
                participantLimit,
                exerciseLimit
            );
            
            if (result.type === 'success') {
                fireToast('success', 'Community limits updated successfully');
                setIsLimitsModalOpen(false);
                refreshCommunities();
            } else {
                fireToast('error', result.message || 'Failed to update community limits');
            }
        });
    };
    
    const handleDeleteCommunity = () => {
        startTransition(async () => {
            const result = await removeCommunityAction(selectedCommunity.id);
            
            if (result.type === 'success') {
                fireToast('success', 'Community removed successfully');
                setIsDeleteModalOpen(false);
                refreshCommunities();
            } else {
                fireToast('error', result.message || 'Failed to remove community');
            }
        });
    };
    
    const openLimitsModal = (community) => {
        setSelectedCommunity(community);
        setIsLimitsModalOpen(true);
    };
    
    const openDeleteModal = (community) => {
        setSelectedCommunity(community);
        setIsDeleteModalOpen(true);
    };
    
    return (
        <PageBase>
            <div className="px-4 py-6 md:p-8 space-y-6 max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="btn btn-circle btn-primary">
                            <FaBuildingUser />
                        </div>
                        <h1 className="text-3xl font-bold">Owner Dashboard</h1>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <img 
                            src={`/avatars/${user.avatar}.svg`} 
                            alt={user.name} 
                            className="h-8 w-8 rounded-full" 
                        />
                        <span>Owner: {user.name}</span>
                    </div>
                </div>
                
                {/* Owner Dashboard Header */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div>
                            <h2 className="text-2xl font-bold">Community Management</h2>
                            <p className="text-neutral/70">
                                Manage all communities in the system
                            </p>
                        </div>
                        
                        <div className="relative w-full md:w-64">
                            <input 
                                type="text"
                                placeholder="Search communities..."
                                className="input input-bordered w-full pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral/50">
                                <FaGear />
                            </span>
                        </div>
                    </div>
                    
                    <div className="alert alert-info bg-info/10 border-info/20 mb-6">
                        <FaCircleInfo className="text-info" />
                        <div>
                            <h4 className="font-bold">Owner Control Panel</h4>
                            <p className="text-sm">
                                Here you can manage all communities, set limits, and remove communities if needed.
                            </p>
                        </div>
                    </div>
                    
                    {/* Community List */}
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>Community</th>
                                    <th className="text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <FaUserGroup className="text-xs" />
                                            <span>Participants</span>
                                        </div>
                                    </th>
                                    <th className="text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <FaDumbbell className="text-xs" />
                                            <span>Exercises</span>
                                        </div>
                                    </th>
                                    <th className="text-center">Limits</th>
                                    <th className="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCommunities.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-8">
                                            {searchTerm ? 
                                                "No communities match your search" : 
                                                "No communities found"}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCommunities.map(community => (
                                        <CommunityListItem 
                                            key={community.id}
                                            community={community}
                                            onConfigureLimits={() => openLimitsModal(community)}
                                            onDelete={() => openDeleteModal(community)}
                                        />
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            {/* Modals */}
            {selectedCommunity && (
                <>
                    <CommunityLimitsModal 
                        isOpen={isLimitsModalOpen}
                        onClose={() => setIsLimitsModalOpen(false)}
                        community={selectedCommunity}
                        onSave={handleUpdateLimits}
                        isSaving={isPending}
                    />
                    
                    <ConfirmDeleteModal 
                        isOpen={isDeleteModalOpen}
                        onClose={() => setIsDeleteModalOpen(false)}
                        community={selectedCommunity}
                        onConfirm={handleDeleteCommunity}
                        isDeleting={isPending}
                    />
                </>
            )}
        </PageBase>
    );
};

export default OwnerPage;
