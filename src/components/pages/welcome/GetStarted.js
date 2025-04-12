"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";

export default function GetStarted() {
  const [isAnimating, setIsAnimating] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 200);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleStartClick = () => {
    setIsAnimating(true);
    setTimeout(() => {
     router.push("/setup");
    }, 1000);
  };

  return (
    <div className="flex justify-center items-center flex-row gap-2 mb-8 relative">
      <svg
        width="200"
        height="100"
        className={`transition-all absolute left-2 ${
          isAnimating ? "stroke-primary stroke-[6px]" : "stroke-secondary stroke-[4px] flex"
        }`}
      >
        <polyline
          points="0,50 20,50 30,20 40,80 50,50 70,50"
          fill="none"
        />
      </svg>
      <button
        className="btn btn-primary text-lg font-semibold px-8 py-4 animate-bounce duration-1000 ease-in-out"
        onClick={handleStartClick}
      >
        Start Now
      </button>
    </div>
  );
}
