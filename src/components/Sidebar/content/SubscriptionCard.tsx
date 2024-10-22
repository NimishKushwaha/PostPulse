"use client";
import Reder from "@/Icons/Reder";
import React from "react";
import Lottie from "lottie-react";
import alien from "../../../Animation/json/alien.json";
import Animation from "@/Animation/Animation";
const SubscriptionCard = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: alien,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div className="bg-slate-100 flex items-center justify-between p-5 rounded-lg shadow-md max-w-sm">
      <div>
        <h1 className="font-semibold">
          Get unlimited access to everything on PostPulse
        </h1>
        <p className="text-xs mt-2">
        PostPulse is a dynamic blog platform that uses intelligent content-based recommendations to connect users with similar posts, enhancing personalized reading experiences.
        </p>
       
      </div>
      <div>
        <Animation animationData={alien} classes=""></Animation>
      </div>
    </div>
  );
};

export default SubscriptionCard;
