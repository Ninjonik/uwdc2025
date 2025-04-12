import React from 'react';
import PageBase from "@/components/pages/PageBase";
import Link from 'next/link'

const NotFound = () => {
    return (
        <PageBase>
         <h1>404 - NotFound</h1>
         <h2>Better luck next time.</h2>
            <Link href="/communities" className={"btn btn-primary"}>Go Home</Link>
        </PageBase>
    );
};

export default NotFound;