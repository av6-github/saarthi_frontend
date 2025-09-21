"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Link from "next/link" // Import the Link component
import { Button } from "@/components/chatui/ui/button"
import { Input } from "@/components/chatui//ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/chatui/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/chatui/ui/select"
import { Menu, Mic, MessageSquare, Search, Plus, Send, X, ArrowRight } from "lucide-react" // Added ArrowRight icon

// --- TYPE DEFINITIONS (from backend) ---
interface Message {
  role: 'user' | 'assistant';
  content: string;
  persona?: string; 
  imageUrl?: string; // ADDED: Optional field for images in messages
}

interface ChatMetadata {
  id: string;
  title: string;
  last_persona: string;
  timestamp: number;
}

const personas = [
    { value: "wise_elder", label: "Wise Elder", avatar: "/chatbot_img/wise_elder.jpg" },
    { value: "empathizer", label: "Empathizer", avatar: "/chatbot_img/empathiser.jpg" },
    { value: "motivator", label: "Motivator", avatar: "/chatbot_img/motivator.jpg" },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

// --- HARDCODED CHAT DATA ---
const hardcodedChatId = "special-chat-1";

const hardcodedChatMetadata: ChatMetadata = {
  id: hardcodedChatId,
  title: "A Happy Memory",
  last_persona: "empathizer",
  timestamp: Date.now(),
};

// NOTE: Make sure you have an image at public/chatbot_img/happy_memory.jpg
const hardcodedMessages: Message[] = [
  {
    role: "user",
    content: "I'm feeling really down today.",
  },
  {
    role: "assistant",
    content: "I'm sorry to hear that. Sometimes looking back helps. Here is what made you happy last week, revisit those memories!",
    persona: "empathizer",
    imageUrl: "/chatbot_img/happy_memory.jpg", 
  },
];


// --- MAIN COMPONENT ---
export default function ChatInterface() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedPersona, setSelectedPersona] = useState("empathizer");
  const [isResizing, setIsResizing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMetadata[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- API FUNCTIONS ---
  const fetchChats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/chats`);
      if (!response.ok) throw new Error("Network response was not ok");
      const data: ChatMetadata[] = await response.json();
      // Add the hardcoded chat to the beginning of the fetched list
      setChatHistory([hardcodedChatMetadata, ...data]);
      return [hardcodedChatMetadata, ...data];
    } catch (error) {
      console.error("Failed to fetch chats:", error);
      setChatHistory([hardcodedChatMetadata]); // Still show hardcoded chat on error
      return [hardcodedChatMetadata];
    }
  };

  const fetchChatHistory = async (chatId: string) => {
    // If it's the special chat, load hardcoded messages instead of fetching
    if (chatId === hardcodedChatId) {
      setMessages(hardcodedMessages);
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/chats/${chatId}`);
      if (!response.ok) throw new Error("Network response was not ok");
      const data: Message[] = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
    }
  };

  const handleNewChat = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/api/new_chat`, { method: 'POST' });
      if (!response.ok) throw new Error("Network response was not ok");
      const newChat: ChatMetadata = await response.json();
      setMessages([]);
      setActiveChatId(newChat.id);
      await fetchChats();
    } catch (error) {
      console.error("Failed to create new chat:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteChat = async (chatIdToDelete: string) => {
    try {
      const response = await fetch(`${API_URL}/api/chats/${chatIdToDelete}`, { method: 'DELETE' });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete chat on server.");
      }
      
      const updatedChats = await fetchChats();
      
      if (activeChatId === chatIdToDelete) {
        if (updatedChats.length > 0) {
          handleChatSelect(updatedChats[0].id);
        } else {
          await handleNewChat();
        }
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
      alert(`Error: ${error}`);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !activeChatId || activeChatId === hardcodedChatId) return;

    const userMessage: Message = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput,
          chatId: activeChatId,
          persona: selectedPersona
        }),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const assistantMessage: Message = await response.json();
      setMessages(prev => [...prev, assistantMessage]);
      await fetchChats();
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage: Message = { role: 'assistant', content: "Sorry, I couldn't connect. Please ensure the backend is running.", persona: selectedPersona };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- UI HANDLERS ---
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      handleSendMessage();
    }
  };

  const handleChatSelect = (chatId: string) => {
    setActiveChatId(chatId);
    const selectedChat = chatHistory.find(c => c.id === chatId) || (chatId === hardcodedChatId ? hardcodedChatMetadata : null);
    if (selectedChat) {
      setSelectedPersona(selectedChat.last_persona);
      fetchChatHistory(chatId);
    }
  };

  const startResizing = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsResizing(true);
  };

  // --- EFFECTS ---
  useEffect(() => {
    fetchChats().then(chats => {
      if (chats.length > 0 && !activeChatId) {
        handleChatSelect(chats[0].id)
      } else if (chats.length === 0) {
        handleNewChat();
      }
    });
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        const newWidth = Math.max(200, Math.min(500, e.clientX));
        setSidebarWidth(newWidth);
      }
    };
    const handleMouseUp = () => setIsResizing(false);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // --- RENDER LOGIC ---
  const getPersonaData = (personaId: string) => {
    return personas.find((p) => p.value === personaId) || personas[1];
  };

  const filteredChatHistory = chatHistory.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-amber-50 via-stone-100 to-yellow-50 relative">
      <div
        className="absolute inset-0 opacity-30"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23d4a574' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%E3C/g%E3C/svg%3E")` }}
      />

      {sidebarOpen && (
        <>
          <div ref={sidebarRef} className="bg-stone-100/80 backdrop-blur-sm border-r border-stone-200/50 flex flex-col shadow-lg relative z-20 rounded-l-[30px] overflow-hidden" id="sidebar" style={{ width: sidebarWidth }}>
            <div className="p-4 border-b border-stone-200/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center">
                    <span className="logo_img"><img src="/chatbot_img/saarthi_logo.png" alt="S" className="w-10 h-10 object-contain"/></span>
                  </div>
                  <h1 className="text-xl font-bold text-stone-800">Saarthi</h1>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)} className="h-8 w-8 p-0 hover:bg-stone-200">
                  <Menu className="w-4 h-4 text-black" />
                </Button>
              </div>
              <Button onClick={handleNewChat} className="w-full bg-yellow-600 hover:bg-yellow-700 text-white rounded-full mb-4">
                <Plus className="w-4 h-4 mr-2" /> New Chat
              </Button>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="Search Chat" value={searchQuery} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)} className="pl-10 bg-white/70 border-stone-200/50 rounded-full text-black/80" />
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-700" />
                <span className="font-semibold text-stone-800">Chats</span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 px-4 space-y-2 sidebar-scroll">
              {filteredChatHistory.map((chat) => {
                const personaData = getPersonaData(chat.last_persona);
                return (
                  <div key={chat.id} onClick={() => handleChatSelect(chat.id)}
                    className={`group flex items-center justify-between p-3 rounded-xl hover:bg-white/60 cursor-pointer transition-colors ${activeChatId === chat.id ? "bg-white/80 border border-amber-200" : ""}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                        <img src={personaData.avatar} alt={personaData.label} className="w-6 h-6 rounded-full object-cover" />
                      </div>
                      <p className="text-sm font-medium text-stone-800 truncate">{chat.title}</p>
                    </div>
                    {/* Disable delete for the special chat */}
                    {chat.id !== hardcodedChatId && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 text-stone-500 hover:text-red-500 transition-opacity flex-shrink-0"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          if (window.confirm("Are you sure you want to delete this chat? This action cannot be undone.")) {
                            handleDeleteChat(chat.id);
                          }
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="p-4 border-t border-stone-200/50">
              <div className="flex items-center gap-3 p-3 bg-amber-100/50 rounded-xl">
                <Avatar className="w-8 h-8"><AvatarImage src="/chatbot_img/abstract-geometric-shapes.png" /><AvatarFallback>UN</AvatarFallback></Avatar>
                <span className="text-sm font-medium text-stone-800">User Name</span>
              </div>
            </div>
          </div>
          <div className="w-1 bg-stone-200/50 hover:bg-stone-300 cursor-col-resize transition-colors relative z-20" onMouseDown={startResizing} />
        </>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative z-10">
        <div className="flex-1 overflow-y-auto p-6 relative" style={{ background: "linear-gradient(150deg, #ffffff, #d8b16d , #ededb4)" }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[90%] bg-white/30 backdrop-blur-lg rounded-2xl shadow-lg pointer-events-none" />
          {!sidebarOpen && (
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)} className="mb-4 bg-white/50 hover:bg-white/80 backdrop-blur-sm">
              <Menu className="w-4 h-4 mr-2" />Menu
            </Button>
          )}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[90%] overflow-y-auto p-2 relative z-10 flex flex-col">
            <div className="flex-grow space-y-4">
              {messages.length === 0 && !isLoading ? (
                <div className="flex items-center justify-center h-full text-stone-600">
                  <h1 className="text-2xl font-semibold text-stone-700 mb-8">How are you feeling today?</h1>
                </div>
              ) : (
                messages.map((message, index) => {
                  const personaForMessage = getPersonaData(message.persona || selectedPersona);
                  return (
                    <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? "justify-end ml-auto" : "justify-start mr-auto"} mb-4 w-full`}>
                      {message.role === 'assistant' && (
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                          <img src={personaForMessage.avatar} alt={personaForMessage.label} className="w-6 h-6 rounded-full object-cover" />
                        </div>
                      )}
                      <div className={`max-w-md px-3 py-2 rounded-2xl backdrop-blur-md shadow-lg border border-white/20 ${message.role === 'user' ? "bg-gradient-to-r from-amber-500/90 to-yellow-600/90 text-white" : "bg-white/30 text-stone-800"}`} style={{ backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
                        <p className="text-xs" style={{ whiteSpace: 'pre-wrap' }}>{message.content}</p>
                        {message.imageUrl && (
                          <div className="mt-2">
                            <div className="rounded-lg overflow-hidden border border-white/20">
                              <img src={message.imageUrl} alt="Happy memory" className="w-full h-auto" />
                            </div>
                            <Link href="/memory-lane" passHref>
                              <button className="mt-2 flex items-center gap-2 text-xs text-amber-800 hover:text-amber-900 font-semibold transition-colors">
                                View in Memory Lane
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            </Link>
                          </div>
                        )}
                      </div>
                      {message.role === 'user' && (
                        <Avatar className="w-6 h-6 flex-shrink-0"><AvatarImage src="/chatbot_img/abstract-geometric-shapes.png" /><AvatarFallback>U</AvatarFallback></Avatar>
                      )}
                    </div>
                  )
                })
              )}
              {isLoading && (
                <div className="flex items-start gap-3 justify-start mr-auto mb-4 w-full">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                    <img src={getPersonaData(selectedPersona).avatar} alt={getPersonaData(selectedPersona).label} className="w-6 h-6 rounded-full object-cover" />
                  </div>
                  <div className="max-w-md px-3 py-2 rounded-2xl backdrop-blur-md shadow-lg border border-white/20 bg-white/30 text-stone-800" style={{ backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
                    <p className="text-xs">Typing...</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
        <div className="p-6 backdrop-blur-sm border-t border-stone-200/50" style={{ background: "linear-gradient(150deg, #d8b16d , #ededb4)" }}>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md p-1 rounded-full shadow border border-stone-200/50 px-3">
              <Select value={selectedPersona} onValueChange={setSelectedPersona}>
                <SelectTrigger className="w-13 h-13 rounded-full border-0 bg-transparent p-0">
                  <div className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center">
                    <img src={getPersonaData(selectedPersona).avatar} alt={getPersonaData(selectedPersona).label} className="w-full h-full object-cover" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {personas.map((persona) => (
                    <SelectItem key={persona.value} value={persona.value}>
                      <div className="flex items-center gap-2">
                        <span><img src={persona.avatar} alt={persona.label} className="w-6 h-6 rounded-full object-cover" /></span>
                        <span>{persona.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={inputValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Write your feelings here..."
                className="flex-1 border-0 bg-transparent focus-visible:ring-0 text-xs py-1"
                disabled={isLoading || activeChatId === hardcodedChatId}
              />
              <Button size="sm" onClick={handleSendMessage} disabled={isLoading || !inputValue.trim() || activeChatId === hardcodedChatId} className="h-10 w-10 rounded-full bg-amber-600 hover:bg-amber-700 text-white p-0">
                {isLoading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

