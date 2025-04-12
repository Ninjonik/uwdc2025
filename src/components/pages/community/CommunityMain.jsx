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
        if (!loggedInUser?.id) {
            console.error("No logged in user ID available for socket connection");
            return;
        }
        
        let socket;
        try {
            socket = handleSocket({
                type: "community",
                roomId: id,
                userId: loggedInUser.id,
            });
            socketRef.current = socket;

            // Log socket connection events for debugging
            socket.on("connect", () => {
                console.log("Socket connected!");
                setIsConnected(true);
                setTransport(socket.io.engine.transport.name);
            });

            socket.on("disconnect", () => {
                console.log("Socket disconnected!");
                setIsConnected(false);
                setTransport("N/A");
            });

            socket.on("connect_error", (error) => {
                console.error("Socket connection error:", error);
                setIsConnected(false);
                setTransport("N/A");
            });

            socket.on("connectionConfirmed", (data) => {
                console.log("Socket connection confirmed:", data);
            });

            // Listen for the correct event name from the server
            socket.on("completionUpdate", (updatedCommunityData) => {
                console.log("Received completion update:", updatedCommunityData);
                const updatedCommunity = typeof updatedCommunityData === 'string'
                    ? JSON.parse(updatedCommunityData) 
                    : updatedCommunityData;
                
                setCommunity(updatedCommunity);
            });
        } catch (error) {
            console.error("Error setting up socket connection:", error);
        }

        return () => {
            if (socketRef.current) {
                console.log("Cleaning up socket connection");
                socketRef.current.off("connect");
                socketRef.current.off("disconnect");
                socketRef.current.off("connect_error");
                socketRef.current.off("connectionConfirmed");
                socketRef.current.off("completionUpdate");
                socketRef.current.disconnect();
            }
        };
    }, [id, loggedInUser?.id]);

    const isActivityCompleted = currentActivity?.completions?.some(
        (completion) => completion.user.id === loggedInUser?.id
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
