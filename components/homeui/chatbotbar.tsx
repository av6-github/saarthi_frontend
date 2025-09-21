"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

import mic from "@/assets/mic.svg";
import upArrow from "@/assets/up-arrow.svg";

interface ChatbotbarProps {
  open: boolean;
}

const Chatbotbar: FC<ChatbotbarProps> = ({ open }) => {
  return (
    <motion.div
      initial={false}
      animate={{ x: open ? 128 : 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
      className="fixed bottom-0 left-1/2 -translate-x-1/2 px-4 pb-7 w-full max-w-5xl"
    >
      <div
        className="flex justify-between items-center px-6 py-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 shadow-lg font-inter font-normal"
        style={{
          boxShadow: "0 2px 6px rgba(0,0,0,0.25), 4px 6px 12px rgba(0,0,0,0.35)",
        }}
      >
        <div className="flex items-center gap-4 flex-1">
          <button className="p-2 rounded-full hover:bg-white/20 transition cursor-pointer flex-shrink-0">
            <Image src={mic} alt="mic" className="w-7 h-7" />
          </button>

          <input
            type="text"
            placeholder="How do you feel today?"
            className="flex-grow px-2 py-2 text-white placeholder-white/50 outline-none transition duration-300"
            autoFocus
          />

          <button className="px-4 py-3 rounded-xl bg-white text-black font-medium shadow-md transition cursor-pointer flex-shrink-0">
            <Image src={upArrow} alt="send message button" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Chatbotbar;
