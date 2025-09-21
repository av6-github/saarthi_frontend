"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Indie_Flower } from 'next/font/google';
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react"; // Import the Lottie component
// Corrected path to your Lottie JSON file
import crumpleAnimationData from "@/public/vent_room_img/animation.json"; 
import Sidebar from "@/components/homeui/sidebar";

const indieFlower = Indie_Flower({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});



const affirmations = [
  "You are capable of amazing things.",
  "Your feelings are valid and important.",
  "You are resilient and can handle any challenge.",
];
const ventHistory = [
  { startTime: "11:45 PM", duration: "5 min 32 sec" },
  { startTime: "10:30 PM", duration: "12 min 10 sec" },
];

type HistoryPanelProps = {
  isCollapsible?: boolean;
  isVisible?: boolean;
  onCollapseToggle?: () => void;
};

export default function Home() {
  const [currentAffirmationIndex, setCurrentAffirmationIndex] = useState(0);
  const [isAffirmationVisible, setIsAffirmationVisible] = useState(true);
  const [isDesktopHistoryVisible, setIsDesktopHistoryVisible] = useState(true);
  const [isMobileHistoryVisible, setIsMobileHistoryVisible] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [ventState, setVentState] = useState<'idle' | 'venting' | 'animating' | 'finished'>('idle');
  const [ventTimer, setVentTimer] = useState(0);
  const [timerIntervalId, setTimerIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [ventText, setVentText] = useState('');
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
    const affirmationInterval = setInterval(() => {
      setIsAffirmationVisible(false);
      setTimeout(() => {
        setCurrentAffirmationIndex((prev) => (prev + 1) % affirmations.length);
        setIsAffirmationVisible(true);
      }, 500);
    }, 5000);

    return () => {
      clearInterval(affirmationInterval);
      if (timerIntervalId) clearInterval(timerIntervalId);
    };
  }, [timerIntervalId]);

  // This new useEffect handles the responsive collapsing of the sidebar
  useEffect(() => {
    const handleResize = () => {
      // Tailwind's 'lg' breakpoint is 1024px.
      // We collapse the sidebar on screens smaller than this.
      if (window.innerWidth < 1024) {
        setOpen(false);
      }
    };

    // Call handler right away so state is updated with initial window size
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Remove event listener on cleanup to prevent memory leaks
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures effect is only run on mount and unmount

  const handleStartVent = () => {
    setVentState('venting');
    setVentTimer(0);
    const intervalId = setInterval(() => setVentTimer(prev => prev + 1), 1000);
    setTimerIntervalId(intervalId);
  };

  const handleEndVent = () => {
    if (timerIntervalId) clearInterval(timerIntervalId);
    setTimerIntervalId(null);
    setVentState('animating'); 
  };
  
  // This is now the single point of truth for finishing the animation
  const handleLottieComplete = () => {
    setVentState('finished');
  };

  const handleVentAgain = () => {
    setVentState('idle');
    setVentTimer(0);
    setVentText('');
    setIsRecording(false);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const HistoryPanel = ({ isCollapsible = false, onCollapseToggle, isVisible = true }: HistoryPanelProps) => (
     <div className={`w-full h-full flex flex-col items-center gap-2 ${isCollapsible ? '' : 'pt-6'}`}>
      <button onClick={onCollapseToggle} className={`w-full flex justify-center items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-sm focus:outline-none ${!isCollapsible && 'cursor-default'}`} disabled={!isCollapsible}>
        <span>TODAYS VENTING SESSIONS</span>
        {isCollapsible && (<svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-white/80 transition-transform duration-300 ${isVisible ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>)}
      </button>
      <div className={`w-full flex flex-col items-center transition-all duration-500 ease-in-out overflow-hidden ${isVisible ? 'max-h-full opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
        <p className="text-white/80 text-xs mb-2">{currentDate}</p>
        <ul className="w-full flex-grow overflow-y-auto space-y-3 pr-2">{ventHistory.map((item, index) => (<li key={index} className="w-full text-white bg-black/20 p-3 rounded-lg flex justify-between items-center text-sm"><span>{item.startTime}</span><span className="font-medium">{item.duration}</span></li>))}</ul>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <Sidebar open={open} setOpen={setOpen} />

      {/* Main content wrapper that shifts based on sidebar state */}
      <motion.main
        initial={false}
        animate={{
          // Use marginLeft to push the content instead of padding
          marginLeft: open ? "256px" : "64px",
        }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        // Add padding here for breathing room
        className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8"
      >
        <div className="flex w-full max-w-6xl items-start justify-center gap-6">
          <div className="flex flex-grow flex-col items-center gap-6">
            <div className={`w-full h-20 flex items-center gap-4 rounded-full border border-white/30 bg-white/20 backdrop-blur-lg shadow-md pl-6 pr-8 transition-opacity duration-500 ${isAffirmationVisible ? "opacity-100" : "opacity-0"}`}>
              <div className="w-10 h-10 rounded-full bg-white/30 flex-shrink-0"></div>
              <p className="text-white text-xl font-light tracking-wide">{affirmations[currentAffirmationIndex]}</p>
            </div>
            <div className="relative w-full h-[42rem] rounded-3xl border p-8 shadow-lg border-white/20 bg-white/10 backdrop-blur-lg flex items-center justify-center">
              <AnimatePresence mode="wait">
                {(ventState === 'idle' || ventState === 'venting') && (
                  <motion.div 
                    key="paper" 
                    className="w-full h-full"
                    exit={{ scale: 0.8, opacity: 0.5, transition: { duration: 0.4 } }}
                  >
                    <textarea placeholder="Let go of all frustrations..." className={`h-full w-full rounded-xl border-none bg-cover bg-center p-6 text-2xl text-gray-800 placeholder:text-gray-500/80 focus:outline-none focus:ring-0 bg-[url('/vent_room_img/page.png')] resize-none leading-loose ${indieFlower.className}`} value={ventText} onChange={(e) => setVentText(e.target.value)}></textarea>
                    <button onClick={() => setIsRecording(!isRecording)} className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 w-20 h-20 flex items-center justify-center">
                      {isRecording ? (<div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center border-4 border-white/80 shadow-lg animate-pulse"><div className="w-8 h-8 bg-white rounded-md"></div></div>) : (<Image src="/vent_room_img/mic-icon.png" alt="Record" width={80} height={80} />)}
                    </button>
                  </motion.div>
                )}
                
                {ventState === 'animating' && (
                  <motion.div 
                    key="lottie" 
                    className="w-[80%] h-[80%] flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1, transition: { duration: 0.4 } }}
                  >
                    <Lottie 
                      animationData={crumpleAnimationData} 
                      loop={false}
                      onComplete={handleLottieComplete}
                      style={{ height: '100%', width: '100%' }}
                    />
                  </motion.div>
                )}

                {ventState === 'finished' && (
                  <motion.div key="congrats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full flex flex-col items-center justify-center text-white text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-green-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <h2 className="text-3xl font-bold">Great Job!</h2>
                    <p className="text-lg mt-2 text-white/80">Youve successfully completed your vent session.</p>
                    <p className="text-lg text-white/80">Total time: {formatTime(ventTimer)}</p>
                    <button onClick={handleVentAgain} className="mt-8 px-6 py-3 rounded-full bg-white/20 font-semibold hover:bg-white/30 transition-colors">Vent Again</button>
                  </motion.div>
                )}
              </AnimatePresence>
              <button onClick={() => setIsMobileHistoryVisible(true)} className="lg:hidden absolute top-12 right-12 z-10 p-2 rounded-full bg-white/20 text-black hover:bg-white/30 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></button>
            </div>
            <div className="h-28 flex items-center justify-center gap-4 text-white">
              <AnimatePresence mode="wait">
                {ventState === 'animating' ? (
                  <motion.div key="dustbin" initial={{ y: 100, opacity: 0 }} animate={{ y: -80, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }} exit={{ y: 100, opacity: 0, transition: { duration: 0.5, ease: "easeIn" } }}>
                    <svg className="w-36 h-36 text-white/50" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd"></path></svg>
                  </motion.div>
                ) : ventState !== 'finished' ? (
                  <motion.div key="controls" className="flex items-center justify-center gap-4">
                    {ventState === 'venting' && (<span className="text-2xl font-mono bg-black/20 px-4 py-2 rounded-lg">{formatTime(ventTimer)}</span>)}
                    <button onClick={ventState === 'idle' ? handleStartVent : handleEndVent} className="px-8 py-3 rounded-full bg-white/20 text-lg font-semibold hover:bg-white/30 transition-colors shadow-lg">{ventState === 'idle' ? 'Start Vent' : 'End Vent'}</button>
                  </motion.div>
                ) : ( <div key="placeholder" className="h-14"></div> )}
              </AnimatePresence>
            </div>
          </div>
          <div className="hidden lg:flex w-64 flex-shrink-0 h-[42rem] flex-col items-center rounded-3xl border p-6 shadow-lg border-white/10 bg-black/20 backdrop-blur-lg mt-[6.5rem]"><HistoryPanel isCollapsible={true} onCollapseToggle={() => setIsDesktopHistoryVisible(!isDesktopHistoryVisible)} isVisible={isDesktopHistoryVisible}/></div>
        </div>
      </motion.main>
      
      {/* Mobile history panel is now a sibling to the main content */}
      <div className={`lg:hidden fixed top-0 right-0 h-full w-80 max-w-full p-6 bg-black/20 backdrop-blur-xl border-l border-white/10 shadow-2xl z-50 transition-transform duration-300 ease-in-out ${isMobileHistoryVisible ? 'translate-x-0' : 'translate-x-full'}`}>
        <button onClick={() => setIsMobileHistoryVisible(false)} className="absolute top-4 right-4 p-2 text-white"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
        <HistoryPanel />
      </div>
    </div>
  );
}

