"use client"

import React, {useEffect, useRef, useState} from 'react';
import PageBase from "@/components/pages/PageBase";
import CommunityHeader from "@/components/pages/community/CommunityHeader";
import CurrentActivityCard from "@/components/pages/community/CurrentActivityCard";
import CommunityStatsCard from "@/components/pages/community/CommunityStatsCard";
import MembersList from "@/components/pages/community/MembersList";
import ParticipantsList from "@/components/pages/community/ParticipantsList";
import {handleSocket} from "@/lib/socket";

const CommunityMain = ({ initialCommunity, loggedInUser }) => {
    const [community, setCommunity] = useState(initialCommunity);
    
    const [isConnected, setIsConnected] = useState(false);
    const [transport, setTransport] = useState("N/A");
    const socketRef = useRef(null);

    const { name, avatar, currentActivity, users, activities, exercises, createdAt, id } = community;

    // Setup WebSocket connection
    useEffect(() => {
        const socket = handleSocket({
            type: "community",
            roomId: id,
            userId: loggedInUser.id,
        });
        socketRef.current = socket;

        socket.on("connect", () => {
            setIsConnected(true);
            setTransport(socket.io.engine.transport.name);
        });

        socket.on("disconnect", () => {
            setIsConnected(false);
            setTransport("N/A");
        });

        socket.on("activityCompletion", (updatedCommunityData) => {
            console.log("GOT NEW UPDATE", updatedCommunityData)
            const updatedCommunity = typeof updatedCommunityData === 'string'
                ? JSON.parse(updatedCommunityData) 
                : updatedCommunityData;
            
            setCommunity(updatedCommunity);
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("joinRoom");
            socket.off("leaveRoom");
            socket.off("activityCompletion");
            socket.disconnect();
        };
    }, [id, loggedInUser.id]);

    const isActivityCompleted = currentActivity?.completions?.some(
        (completion) => completion.user.id === loggedInUser.id
    ) || false;

    return (
        <PageBase>
            <div className="px-4 py-6 md:p-8 space-y-6 md:space-y-8 max-w-6xl mx-auto">
                <CommunityHeader 
                    name={name} 
                    avatar={avatar} 
                    userCount={users.length}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CurrentActivityCard currentActivity={currentActivity} isCompleted={isActivityCompleted} />
                    
                    <CommunityStatsCard 
                        userCount={users.length}
                        activitiesCount={activities.length}
                        exercisesCount={exercises.length}
                        createdAt={createdAt}
                    />
                </div>

                {currentActivity && (
                    <ParticipantsList 
                        participants={currentActivity.completions}
                        activityStartTime={currentActivity.createdAt}
                    />
                )}

                <MembersList users={users} />
                
                {/* TODO: debug indicator for websocket status - remove for production */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="text-xs text-gray-500 fixed bottom-2 right-2">
                        WebSocket: {isConnected ? 'Connected' : 'Disconnected'} ({transport})
                    </div>
                )}
            </div>
        </PageBase>
    );
};

export default CommunityMain;
