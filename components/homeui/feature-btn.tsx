"use client";

import { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Image, { StaticImageData } from "next/image";

interface FeatureBtnProps {
  title: string;
  description: string;
  details: string;
  src: StaticImageData;
}

const FeatureBtn: FC<FeatureBtnProps> = ({ title, description, details, src }) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  return (
    <div
      className="w-full max-w-[33%] cursor-pointer bg-black/15 backdrop-blur-lg border border-white/30 p-5 font-inter rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.15)] transition duration-300"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex gap-4 items-center justify-between">
        <div className="flex gap-4 items-center">
          <div className="w-22 h-22 rounded-full overflow-hidden">
            <Image src={src} alt={description} className="object-cover w-full h-full" />
          </div>

          <div className="flex flex-col justify-center">
            <p className="font-bold text-gray-900 text-md">{title}</p>
            <p className="text-gray-700/80 text-sm mt-1">{description}</p>
          </div>
        </div>

        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown className="w-5 h-5 text-gray-700" />
        </motion.div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden mt-4"
          >
            <p className="text-gray-700 text-sm leading-relaxed">{details}</p>

            <div className="mt-4 flex justify-end">
              <a
                href="#"
                className="px-4 py-2 rounded-lg bg-black text-white text-sm font-medium shadow-md hover:bg-black/80 transition"
              >
                Explore {title}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeatureBtn;
