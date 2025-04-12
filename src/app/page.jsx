import GetStarted from "@/components/pages/welcome/GetStarted";
import PageBase from "@/components/pages/PageBase";
import {BsFillLightningFill} from "react-icons/bs";

export default function Home() {
  return (
    <PageBase>
      <h1 className="text-4xl font-bold text-neutral mb-4">
        Welcome to ActivePulse
      </h1>
      <p className="text-lg text-primary italic font-semibold mb-6">
        Stay Ready. Stay Active. Stay Together.
      </p>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-neutral/5 transition-all hover:shadow-xl">
        <div className="bg-gradient-to-r from-accent/20 to-accent/5 p-4">
          <div className="flex items-center gap-3">
            <div className="bg-accent rounded-lg p-2 text-white">
                <BsFillLightningFill className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-neutral">Get Started Now</h2>
          </div>
        </div>

        <div className="p-6">
          <p className="text-base mb-6">
            It's never been easier to get moving. Join your community for a daily burst of fun and fitness activities designed to keep you motivated and connected.
          </p>
          <GetStarted />
        </div>
      </div>
    </PageBase>
  );
}
