"use client";

import React, { useState, useEffect } from "react";
import {
  DynamicContextProvider,
  DynamicWidget,
  useDynamicContext,
} from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { createClient } from "@supabase/supabase-js";
import { PackageOpen, ScrollText } from "lucide-react";

// ==========================================
// 1. SUPABASE DATABASE CONNECTION
// ==========================================
// Aapki provide ki gayi URL aur Key yahan add kar di hai
const supabaseUrl = "https://mruyjzbongjchijusyof.supabase.co"; 
const supabaseAnonKey = "sb_publishable_qPsGNqUMMY7_Pq6fimlyHg_asPyaRvk";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ==========================================
// 2. MAIN DASHBOARD COMPONENT
// ==========================================
function Dashboard() {
  const { primaryWallet } = useDynamicContext();
  const [quests, setQuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"quests" | "history">("quests");

  // Admin Wallet Check (Only for your specific address)
  const isAdmin = primaryWallet?.address?.toLowerCase() === "0x53B611172889039F642e37a384bA7089791De30A".toLowerCase();

  const fetchQuests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("quests")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setQuests(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQuests();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-16">
      
      {/* HEADER: Small Logo vertically aligned with text */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center font-bold text-lg align-middle shadow-md">
            K
          </div>
          <h1 className="text-2xl font-extrabold align-middle tracking-tight text-slate-800">
            Kalix
          </h1>
        </div>
        <div>
          {/* Dynamic.xyz Wallet Widget */}
          <DynamicWidget />
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-3xl mx-auto mt-8 px-4">
        
        {/* Intro Section */}
        <div className="mb-10 text-center">
          <p className="text-slate-600 font-medium text-base leading-relaxed max-w-lg mx-auto">
            Earn points by contributing to the growth of the Kalix community. Points from social update daily.
          </p>
        </div>

        {/* ADMIN DASHBOARD: Only visible to 0x53B... address */}
        {isAdmin && (
          <div className="mb-8 p-6 bg-white border border-purple-100 rounded-2xl shadow-sm text-center">
            <h2 className="text-lg font-bold text-purple-700 mb-2">Admin Dashboard</h2>
            <p className="text-sm text-slate-500 mb-4">You have admin access to manage quests.</p>
            <button className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-6 py-2.5 rounded-xl font-bold transition-all shadow-md">
              + Add New Quest
            </button>
          </div>
        )}

        {/* NAVIGATION TABS */}
        <div className="flex space-x-2 mb-6 border-b border-slate-200 pb-2">
          <button 
            onClick={() => setActiveTab("quests")}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === "quests" ? "bg-slate-200 text-slate-900" : "text-slate-500 hover:bg-slate-100"}`}
          >
            Active Quests
          </button>
          <button 
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === "history" ? "bg-slate-200 text-slate-900" : "text-slate-500 hover:bg-slate-100"}`}
          >
            My History
          </button>
        </div>

        {/* CONTENT FOR ACTIVE QUESTS */}
        {activeTab === "quests" && (
          <div>
            {loading ? (
              <p className="text-center text-slate-400 p-10 font-bold animate-pulse">Checking for quests...</p>
            ) : quests.length === 0 ? (
              /* EMPTY STATE: Matches your screenshot design exactly */
              <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm">
                <div className="flex justify-center mb-6">
                  <PackageOpen className="w-16 h-16 text-slate-200" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-800">No quests available</h3>
                <p className="text-slate-500 font-medium text-sm max-w-sm mx-auto">
                  There are currently no active quests. Check back soon for new opportunities to earn points.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {quests.map((quest) => (
                  <div key={quest.id} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 transition hover:shadow-md">
                    <div>
                      <h4 className="font-bold text-lg text-slate-900">{quest.title}</h4>
                      <p className="text-sm text-slate-500 mt-1">{quest.description}</p>
                    </div>
                    <button className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl text-sm whitespace-nowrap transition">
                      Earn {quest.reward_points} Pts
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CONTENT FOR HISTORY TAB */}
        {activeTab === "history" && (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm">
            <div className="flex justify-center mb-6">
              <ScrollText className="w-16 h-16 text-slate-200" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-800">No points history yet</h3>
            <p className="text-slate-500 font-medium text-sm max-w-sm mx-auto">
              You haven't earned any loyalty points yet. Start participating in activities to see your rewards accumulate here!
            </p>
          </div>
        )}

      </main>
    </div>
  );
}

// ==========================================
// 3. APP WRAPPER WITH DYNAMIC PROVIDER
// ==========================================
export default function App() {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: "1ebbcf69-cefa-4bd9-ac74-2b7da156045a",
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      <Dashboard />
    </DynamicContextProvider>
  );
}
