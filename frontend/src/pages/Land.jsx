import React from "react";
import { useNavigate } from "react-router-dom";

// Components Import
import Navbar from "../custom/Navbar";
import { Button } from "../components/ui/button";

// Assets Import
import { Github, ArrowRight } from "lucide-react";

const Land = () => {
  return (
    <div className="w-full h-screen overflow-hidden bg-gradient-to-b from-black via-zinc-800 to-black  flex items-center justify-center">
      <Navbar />
      <Intro />
    </div>
  );
};

export default Land;

// Components Import
const Intro = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full h-auto flex flex-col items-center gap-8">
      <Button className="rounded-full bg-transparent border-[1px] border-zinc-300">
        Welcome to Auto-Note <ArrowRight />
      </Button>
      <h1 className="w-[55%] text-5xl font-[Inter] text-center text-white">
        "A NFT Based Ticket App Whichs Makes Buying & Selling of Tickets Easy"
      </h1>
      <p className="w-[40%] text-center text-base font-[Inter] text-zinc-500">
        An NFT-based ticketing app makes buying, selling, and transferring
        tickets easy and secure using blockchain technology, ensuring
        transparency and preventing fraud.
      </p>
      <div className="flex items-center gap-20">
        <Button className="w-36 h-12" onClick={() => navigate("/auth")}>
          Get Started <ArrowRight />{" "}
        </Button>
        <Button className="w-36 h-12">Github</Button>
      </div>
    </div>
  );
};
