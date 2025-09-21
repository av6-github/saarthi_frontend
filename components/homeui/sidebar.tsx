"use client";

import { FC } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";


// NOTE: Make sure these import paths are correct for your project structure
import mentorIcon from "@/assets/mentor-icon.svg";
import counsellorIcon from "@/assets/counsellor-icon.svg";
import blogIcon from "@/assets/blogs-icon.svg";
import ventRoomIcon from "@/assets/vent-room-icon.svg";
import asmrIcon from "@/assets/asmr-icon.svg";
import journalIcon from "@/assets/journal-icon.svg";
import chatbotIcon from "@/assets/chatbot-icon.svg";
import forumIcon from "@/assets/forum-icon.svg";
import saarthiLogo from "@/assets/saarthi-logo.png";

interface SidebarProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface MenuItem {
  name: string;
  icon: StaticImageData;
  href: string;
}

const menuItems: MenuItem[] = [
  { name: "Mentors", icon: mentorIcon, href: "/"},
  { name: "Counsellor session", icon: counsellorIcon, href: "/" },
  { name: "Blog", icon: blogIcon, href: "/" },
  { name: "Vent room", icon: ventRoomIcon, href: "/vent_room" },
  { name: "ASMR", icon: asmrIcon, href: "/" },
  { name: "My Journal", icon: journalIcon, href: "/" },
  { name: "Chatbot", icon: chatbotIcon, href: "/chatbot" },
  { name: "Forum", icon: forumIcon, href: "/" },
];

const Sidebar: FC<SidebarProps> = ({ open, setOpen }) => {
  return (
    <motion.div
      initial={false}
      animate={{
        width: open ? 256 : 64,
      }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className="h-screen fixed top-0 left-0 z-50 flex flex-col justify-between text-white shadow-xl border-r border-white/10 bg-gradient-to-b from-black/75 via-black/70 to-black/80 backdrop-blur-xl overflow-hidden"
    >
      <div>
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <AnimatePresence>
            {open && (
              <motion.div
                key="logo"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="font-bold text-lg whitespace-nowrap font-poppins flex items-center gap-2"
              >
                <Image src={saarthiLogo} alt="Logo of Saarthi app" className="w-12" />
                <h1>Saarthi</h1>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-md hover:bg-white/10 transition"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex flex-col gap-2 p-4">
          {menuItems.map((item, i) => (
            <Link key={i} href={item.href} passHref>
              <motion.div
                className="flex items-center gap-3 p-2 rounded-md hover:bg-white/10 transition font-inter text-sm font-normal cursor-pointer"
                initial={false}
                whileHover={{ scale: 1.03 }}
              >
                <Image src={item.icon} alt={item.name} className="h-5 w-5" />
                <AnimatePresence>
                  {open && (
                    <motion.span
                      key={item.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.25, delay: i * 0.05 }}
                      className="whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-3 border-t border-white/10 flex items-center gap-3 hover:bg-white/5 transition-colors duration-200 cursor-pointer">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-sm font-bold shrink-0 ring-1 ring-white/10 shadow-md">
          D
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              key="user-info"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col justify-center overflow-hidden"
            >
              <span className="font-medium text-sm truncate">Rohit Shetty</span>
              <span className="text-xs text-white/60 truncate">rohit.shetty@gmail.com</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Sidebar;
