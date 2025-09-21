"use client";

import { FC } from "react";

const JournalMiniApp: FC = () => {
  return (
    <div
      className="flex flex-col bg-black/40 backdrop-blur-xl border border-white/10 p-3 max-w-[24%] rounded-2xl gap-3 shadow-[3px_4px_12px_rgba(0,0,0,0.6),-1px_-1px_4px_rgba(0,0,0,0.25)]"
    >
      <div className="flex justify-end items-center">
        <div
          className="bg-white/10 hover:bg-white/20 h-8 w-8 rounded-xl flex justify-center items-center text-xl text-white cursor-pointer transition duration-300 shadow-inner"
        >
          +
        </div>
      </div>

      <div className="text-white flex flex-col gap-2">
        <div
          className="bg-black/30 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-[2px_3px_8px_rgba(0,0,0,0.5),-1px_-1px_2px_rgba(0,0,0,0.2)]"
        >
          <p className="text-gray-200 text-xs">September 19, 2025</p>
          <p className="text-[0.65rem] text-gray-300 font-light mt-1">
            Hello, I am Devraj&apos;s friend, good friend. Devraj is a really good man, a Sundar Rani guy...
          </p>
        </div>

        <div
          className="bg-black/30 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-[2px_3px_8px_rgba(0,0,0,0.5),-1px_-1px_2px_rgba(0,0,0,0.2)]"
        >
          <p className="text-gray-200 text-xs">September 17, 2025</p>
          <p className="text-[0.65rem] text-gray-300 font-light mt-1">
            Hello, I am again Devraj&apos;s friend. Devraj is good boy. He goes to gym at 9 pm everyday. He lives in Thane.
          </p>
        </div>
      </div>

      <div className="flex justify-center items-center mt-1">
        <button
          className="bg-gradient-to-r from-yellow-400 to-amber-500 px-5 py-1.5 rounded-xl text-xs text-black font-medium shadow-[1px_2px_4px_rgba(0,0,0,0.25),-1px_-1px_1px_rgba(0,0,0,0.1)] hover:shadow-[2px_3px_6px_rgba(0,0,0,0.3),-1px_-1px_1px_rgba(0,0,0,0.08)] hover:scale-105 transition duration-300 cursor-pointer"
        >
          Start Journaling
        </button>
      </div>
    </div>
  );
};

export default JournalMiniApp;
