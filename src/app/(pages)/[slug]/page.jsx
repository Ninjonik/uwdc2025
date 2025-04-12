import React from 'react';
import PageBase from "@/components/pages/PageBase";
import {getCommunityBySlug} from "@/utils/db/community";
import NotFound from "@/app/not-found";
import {FaChartBar, FaUsers} from "react-icons/fa6";
import {MdOutlineAccessTime} from "react-icons/md";

const Page = async (props) => {
    const params = await props.params;
    const slug = params?.slug;

    // Get community data
    const community = await getCommunityBySlug(slug);
    if (!community) return <NotFound />;

    const { name, avatar, currentActivity, users } = community;

    return (
        <PageBase>
            <div className="px-4 py-6 md:p-8 space-y-6 md:space-y-8 max-w-6xl mx-auto">
                <div className="relative rounded-2xl bg-gradient-to-br from-primary/90 to-primary/70 p-8 text-white shadow-xl overflow-hidden">
                    <div className="absolute inset-0 bg-pattern opacity-10"></div>
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
                        <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-white/10 blur-md"></div>
                            <img 
                                src={`/avatars/${avatar}.svg`} 
                                alt={`${name} avatar`} 
                                className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white/20 relative z-10 object-cover" 
                            />
                        </div>
                        <div className="text-center md:text-left space-y-2">
                            <h1 className="text-3xl font-extrabold">{name}</h1>
                            <div className="flex items-center justify-center md:justify-start gap-2 text-white/80">
                                <FaUsers />
                                <span>{users.length} members</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-neutral/5 transition-all hover:shadow-xl">
                        <div className="bg-gradient-to-r from-accent/20 to-accent/5 p-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-accent rounded-lg p-2 text-white">
                                    <MdOutlineAccessTime />
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
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 mr-2">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>Started 2h ago</span>
                                    </div>
                                    <button className="btn btn-primary w-full gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                        Join Activity
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col items-center py-8 text-center">
                                    <div className="bg-error/10 p-3 rounded-full mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-error">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </div>
                                    <p className="text-error font-medium">No ongoing activities</p>
                                    <p className="text-neutral/60 text-sm mt-2">Check back later or create one</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-neutral/5">
                        <div className="bg-gradient-to-r from-neutral/20 to-neutral/5 p-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-neutral rounded-lg p-2 text-white">
                                    <FaChartBar />
                                </div>
                                <h2 className="text-xl font-bold text-neutral">Community Stats</h2>
                            </div>
                        </div>
                        
                        <div className="p-6">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-base-100 p-4 rounded-xl text-center">
                                    <p className="text-2xl font-bold text-primary">{users.length}</p>
                                    <p className="text-xs uppercase tracking-wider text-neutral/70 font-medium">Members</p>
                                </div>
                                
                                <div className="bg-base-100 p-4 rounded-xl text-center">
                                    <p className="text-2xl font-bold text-accent">{community.activities.length}</p>
                                    <p className="text-xs uppercase tracking-wider text-neutral/70 font-medium">Activities</p>
                                </div>
                                
                                <div className="bg-base-100 p-4 rounded-xl text-center">
                                    <p className="text-2xl font-bold text-success">{community.exercises.length}</p>
                                    <p className="text-xs uppercase tracking-wider text-neutral/70 font-medium">Exercises</p>
                                </div>
                            </div>
                            
                            <div className="mt-6 pt-6 border-t border-neutral/10">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-neutral/70">Community created</span>
                                    <span className="text-sm font-medium">{new Date(community.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-neutral/5">
                    <div className="bg-gradient-to-r from-primary/20 to-primary/5 p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-primary rounded-lg p-2 text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-neutral">Members</h2>
                            </div>
                            {users.length > 10 && (
                                <button className="text-primary text-sm font-medium flex items-center gap-1">
                                    View all
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                    
                    <div className="p-6">
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                            {users.slice(0, 16).map((user) => (
                                <div key={user.id} className="flex flex-col items-center group cursor-pointer">
                                    <div className="relative mb-2 transition-transform transform group-hover:scale-105 duration-200">
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <img
                                            src={`/avatars/${user.avatar}.svg`}
                                            alt={user.name}
                                            className="w-16 h-16 rounded-full border-2 border-base-200 shadow-sm object-cover relative z-10"
                                        />
                                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-success rounded-full border-2 border-white z-20"></div>
                                    </div>
                                    <p className="text-xs font-medium text-center truncate w-full">{user.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </PageBase>
    );
};

export default Page;
