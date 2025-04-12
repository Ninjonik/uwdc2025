import {getLoggedInUser} from "@/utils/getLoggedInUser";
import OwnerPage from "@/components/pages/owner/OwnerPage";
import {getAllCommunities} from "@/utils/db/owner";

export default async function OwnerPageRoute() {
    const user = await getLoggedInUser();
    const communities = await getAllCommunities();
    
    return <OwnerPage communities={communities} user={user} />;
}
