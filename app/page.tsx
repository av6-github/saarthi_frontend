"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import Chatbotbar from "@/components/homeui/chatbotbar";
import FeatureBtn from "@/components/homeui/feature-btn";
import JournalMiniApp from "@/components/homeui/jounal-mini-app";
import Dashboard from "@/components/homeui/dashboard";
import Sidebar from "@/components/homeui/sidebar";

import memoryLaneImg from "@/assets/memory-lane.png";
import ventRoomImg from "@/assets/vent-room.png";

function HomePage() {
  const [open, setOpen] = useState<boolean>(true);

  return (
    <div
      className="min-h-screen flex"
      style={{
        background:
          "linear-gradient(130deg, #90caf9 25%, #f5f5f5 70%, #90caf9 85%)",
      }}
    >
      <Sidebar open={open} setOpen={setOpen} />

      <motion.div
        animate={{ marginLeft: open ? 256 : 64 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        className="p-6 flex-1"
      >
        <Dashboard />

        <div className="flex justify-between gap-10 mx-auto max-w-[75rem] items-start font-inter mt-6">
          <FeatureBtn
            title="Vent Room"
            src={ventRoomImg}
            description="Shout it out, release stress and feel lighter..."
            details="The Vent Room is your safe space to release thoughts, frustrations, or worries—without judgment or filters. It helps you unload emotional weight so your mind feels lighter and calmer. Sometimes, simply letting it out is the first step toward feeling better."
          />
          <FeatureBtn
            title="Memory Lane"
            src={memoryLaneImg}
            description="Revisit your happy moments, anytime you need..."
            details="Memory Lane is your personal space to store and revisit happy memories. Capture moments that bring you joy and access them anytime you need a mood boost or a gentle reminder of good times."
          />
          <JournalMiniApp />
        </div>

        <div className="mt-6 max-w-[1200px] mx-auto">
          <Chatbotbar open={open} />
        </div>
      </motion.div>
    </div>
  );
}

export default HomePage;