import React from 'react';
import {FaCog, FaDumbbell, FaTrash} from 'react-icons/fa';
import Link from 'next/link';
import {FaUserGroup} from "react-icons/fa6";

const CommunityListItem = ({ community, onConfigureLimits, onDelete }) => {
    return (
        <tr className="hover:bg-base-100/50">
            <td>
                <div className="flex items-center gap-3">
                    <div className="avatar placeholder">
                        <Link href={`/${community.id}`} key={community.id} className={"h-8 w-8"}>
                            <img src={`/avatars/${community.avatar}.svg`} alt={community.name} className={"h-24 w-24"} />
                        </Link>
                    </div>
                    <div>
                        <div className="font-bold">{community.name}</div>
                        <div className="text-sm text-neutral/60">Admin: {community.owner.name}</div>
                    </div>
                </div>
            </td>
            <td className="text-center">
                <div className="flex flex-col items-center">
                    <span className="text-xl font-semibold">{community.users.length}</span>
                    {community.participantLimit > 0 && (
                        <span className="text-xs text-neutral/60">
                            of {community.participantLimit}
                        </span>
                    )}
                </div>
            </td>
            <td className="text-center">
                <div className="flex flex-col items-center">
                    <span className="text-xl font-semibold">{community.exercises.length}</span>
                    {community.exerciseLimit > 0 && (
                        <span className="text-xs text-neutral/60">
                            of {community.exerciseLimit}
                        </span>
                    )}
                </div>
            </td>
            <td className="text-center">
                <div className="badge badge-outline p-3 gap-2">
                    <FaUserGroup className="text-xs" />
                    {community.participantLimit || '∞'}
                </div>
                <div className="badge badge-outline p-3 gap-2 ml-2">
                    <FaDumbbell className="text-xs" />
                    {community.exerciseLimit || '∞'}
                </div>
            </td>
            <td>
                <div className="flex justify-center gap-2">
                    <Link
                        href={`/${community.id}`}
                        className="btn btn-sm btn-circle btn-secondary text-info"
                        title="View Community"
                    >
                        <FaUserGroup />
                    </Link>
                    <button
                        onClick={onConfigureLimits}
                        className="btn btn-sm btn-circle btn-secondary text-warning"
                        title="Configure Limits"
                    >
                        <FaCog />
                    </button>
                    <button
                        onClick={onDelete}
                        className="btn btn-sm btn-circle btn-secondary text-error"
                        title="Delete Community"
                    >
                        <FaTrash />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default CommunityListItem;
