import React from 'react';
import PageBase from "@/components/pages/PageBase";
import CreateCommunityForm from "@/components/pages/setup/CreateCommunityForm";
import {getLoggedInUser} from "@/utils/getLoggedInUser";
import prisma from "@/lib/prisma";
import Link from 'next/link'
import JoinCommunityForm from "@/components/pages/setup/JoinCommunityForm";

const Communities = async () => {
    const user =  await getLoggedInUser();
    const communities = await prisma.community.findMany({
        where: {
            users: {
                some: {
                    id: user.id
                }
            }
        }
    });

    return (
        <PageBase>
            <main className={"flex flex-col gap-4"}>
                {communities && communities.length > 0 && (
                    <section className={"flex flex-col gap-2"}>
                        <h3>Communities you are already in</h3>
                        <div className={"flex flex-wrap gap-2"}>
                            {communities.map((community) => (
                                <Link href={`/${community.id}`} key={community.id} className={"flex flex-col gap-2 justify-center items-center hover:scale-125 transition-all ease-in-out hover:cursor-pointer"}>
                                    <img src={`/avatars/${community.avatar}.svg`} alt={community.name} className={"h-24 w-24"} />
                                    <p>{community.name}</p>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                <section className={"flex flex-col gap-2"}>
                    <h3>Join an existing community</h3>
                    <JoinCommunityForm />
                </section>
                <section className={"flex flex-col gap-2 justify-center items-center w-full"}>
                    <h3>Create a new community</h3>
                    <CreateCommunityForm />
                </section>
            </main>
        </PageBase>
    );
};

export default Communities;